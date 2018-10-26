import Container from "../../engine/Container";
import Point from "../../engine/geometry/Point";
import Rect from "../../engine/geometry/Rect";
import {AnimationType} from "../../engine/Engine2d";
import {input, InputAction} from "../Input";
import Box from "../../engine/geometry/Box";
import Utils from "../../engine/geometry/Utils";

enum TankDirection {UP, DOWN, LEFT, RIGHT, STAY}

export default class Tank extends Container{

    // private pos: Point;
    private speed:number = 2.5;
    private direction: TankDirection = TankDirection.UP;

    constructor() {

        super(new Rect(0,0,32,32));
        
        // this.pos = new Point(0,0);

        this.addSprite(1, 'tank_1', [new Point(0,0)])
            .spriteState(1, 'up', AnimationType.STATIC)
            .setCollisionGroup('player1')
            .setZIndex(10)
            .setVisible(false);

    }

    public spawn(start: Point):Tank {
        // this.pos = start;
        this.setPosition(start);
        this.setVisible(true);
        return this;
    };

    public fire():Tank {

        let offset:Point = new Point(0,0);

        // позиционируем пулю относительно танка
        if(this.direction === TankDirection.UP) { offset.x = 12; offset.y = 0; }
        if(this.direction === TankDirection.DOWN) { offset.x = 12; offset.y = 24; }
        if(this.direction === TankDirection.LEFT) { offset.x = 0;  offset.y = 12; }
        if(this.direction === TankDirection.RIGHT) { offset.x = 24; offset.y = 12; }

        //myBullet.start(x + offsetX, y + offsetY, direction);

        return this;

    };


    public update():void {

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