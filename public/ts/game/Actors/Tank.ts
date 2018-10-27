import Container from "../../engine/Container";
import Point from "../../engine/geometry/Point";
import {Rect} from "../../engine/geometry/Rect";
import {AnimationType} from "../../engine/Engine2d";
import {input, InputAction} from "../Input";
import Utils from "../../engine/geometry/Utils";
import Bullet from "./Bullet";

enum TankDirection {UP, DOWN, LEFT, RIGHT, STAY}
enum TankMode {SPAWNING, ACTIVE, PROTECTED}

export default class Tank extends Container{

    // private pos: Point;
    private speed:number = 2.5;
    private direction: TankDirection = TankDirection.UP;
    private mode: TankMode = TankMode.SPAWNING;

    constructor() {

        super(new Rect(0,0,32,32));

        this.addSprite(1, 'tank_1', [new Point(0,0)])
            .spriteState(1, 'up', AnimationType.STATIC)
            .spriteVisible(1, false)
            .addSprite(2, 'star', [new Point(0,0)])
            .spriteState(2, 'flash', AnimationType.ANIMATE_REPEAT)
            .spriteVisible(2, false)
            .addSprite(3, 'protect', [new Point(0,0)])
            .spriteState(3, 'enable', AnimationType.ANIMATE_REPEAT)
            .spriteVisible(3, false)
            .setCollisionGroup('player1')
            .setZIndex(10)
            .setVisible(false);

    }

    public spawn(start: Point):Tank {

        this.setPosition(start);
        this.setVisible(true);
        this.mode = TankMode.SPAWNING;
        this.spriteVisible(2, true);

        setTimeout(() => {
            this.spriteVisible(2, false).spriteVisible(1, true);
            this.mode = TankMode.ACTIVE;
        }, 1000);

        return this;
    };

    public fire(bullet:Bullet):Tank {

        if(this.mode === TankMode.SPAWNING)
            return this;

        let offset:Point = new Point(0,0);
        bullet.tank = this;

        // позиционируем пулю относительно танка
        if(this.direction === TankDirection.UP) { offset.x = 12; offset.y = 0; }
        if(this.direction === TankDirection.DOWN) { offset.x = 12; offset.y = 24; }
        if(this.direction === TankDirection.LEFT) { offset.x = 0;  offset.y = 12; }
        if(this.direction === TankDirection.RIGHT) { offset.x = 24; offset.y = 12; }

        bullet.start(new Point(this.rect.x, this.rect.y).plus(offset), this.direction);

        return this;

    };

    public setProtect(timeout:number):Tank {

        console.log('Protected!', timeout);

        this.spriteVisible(3, true);
        this.mode = TankMode.PROTECTED;

        setTimeout(() => {
            this.spriteVisible(3, false);
            this.mode = TankMode.ACTIVE;

        }, timeout);

        return this;
    }

    public update():void {

        if(this.mode === TankMode.SPAWNING)
            return;

        let oldPos:Point = this.rect.toPoint();
        let dir:TankDirection;
        let oldDirection: TankDirection = this.direction;

        if(input.isPressed(InputAction.UP)) {
            this.spriteState(1, 'up', AnimationType.ANIMATE_REPEAT);
            dir = TankDirection.UP;
            this.direction = dir;
        } else if(input.isPressed(InputAction.DOWN)) {
            this.spriteState(1, 'down', AnimationType.ANIMATE_REPEAT);
            dir = TankDirection.DOWN;
            this.direction = dir;
        } else if(input.isPressed(InputAction.LEFT)) {
            this.spriteState(1, 'left', AnimationType.ANIMATE_REPEAT);
            dir = TankDirection.LEFT;
            this.direction = dir;
        } else if(input.isPressed(InputAction.RIGHT)) {
            this.spriteState(1, 'right', AnimationType.ANIMATE_REPEAT);
            dir = TankDirection.RIGHT;
            this.direction = dir;
        } else {
            this.spriteAnimation(1, AnimationType.STATIC);
            dir = TankDirection.STAY;
        }

        if(dir === TankDirection.UP)    this.rect.y -= this.speed;
        if(dir === TankDirection.DOWN)  this.rect.y += this.speed;
        if(dir === TankDirection.LEFT)  this.rect.x -= this.speed;
        if(dir === TankDirection.RIGHT) this.rect.x += this.speed;

        if((oldDirection === TankDirection.UP || oldDirection === TankDirection.DOWN)
            && (this.direction === TankDirection.LEFT || this.direction === TankDirection.RIGHT)) {
            // to horizontal
            this.rect.y = Utils.snapToGrid(this.rect.y, 16);
            oldPos.y = this.rect.y;
        }
        if((oldDirection === TankDirection.LEFT || oldDirection === TankDirection.RIGHT)
            && (this.direction === TankDirection.UP || this.direction === TankDirection.DOWN)) {
            // to vertical
            this.rect.x = Utils.snapToGrid(this.rect.x, 16);
            oldPos.x = this.rect.x;
        }

        let collisions = this.findCollidedContainers();
        if(collisions.length > 0) {
            this.setPosition(oldPos);
        }

    };

}