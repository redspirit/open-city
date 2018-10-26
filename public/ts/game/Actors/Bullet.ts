import Container from "../../engine/Container";
import {Rect} from "../../engine/geometry/Rect";
import Point from "../../engine/geometry/Point";
import {AnimationType} from "../../engine/Engine2d";
import Bricks from "./Bricks";

enum TankDirection {UP, DOWN, LEFT, RIGHT, STAY}

export default class Bullet extends Container {

    public speed:number = 8;
    public direction:TankDirection;
    public flying:boolean = false;
    public tank:any;

    constructor() {

        super(new Rect(0,0,8,8));

        this.addSprite(1, 'bullet', [new Point(0, 0)])
            .addSprite(2, 'explode_1', [new Point(-12, -12)])
            .setCollisionGroup('player1')
            .setZIndex(11)
            .setVisible(false)
            .spriteVisible(2, false)
            .spriteState(2, 'explode', AnimationType.ANIMATE_TO_HIDE);

        this.direction = TankDirection.UP;

    }



    public start(pos:Point, dir:TankDirection):Bullet {

        if(this.flying)
            return this;

        this.direction = dir;

        if(this.direction === TankDirection.UP) this.spriteState(1, 'up');
        if(this.direction === TankDirection.DOWN) this.spriteState(1, 'down');
        if(this.direction === TankDirection.LEFT) this.spriteState(1, 'left');
        if(this.direction === TankDirection.RIGHT) this.spriteState(1, 'right');

        this.flying = true;

        this.spriteVisible(1, true)
            .spriteVisible(2, false)
            .setPosition(pos)
            .setVisible(true);

        return this;
    };


    public setSpeed(val:number):Bullet {
        this.speed = val;
        return this;
    };

    public update():void {

        if(!this.flying)
            return;

        if(this.direction === TankDirection.UP) this.rect.y -= this.speed;
        if(this.direction === TankDirection.DOWN) this.rect.y += this.speed;
        if(this.direction === TankDirection.LEFT) this.rect.x -= this.speed;
        if(this.direction === TankDirection.RIGHT) this.rect.x += this.speed;


        let collisions = this.findCollidedContainers([], ['water']);

        if(collisions.length > 0) {

            this.flying = false;

            collisions.forEach((col:Container) => {
                if(col.collisionGroup === 'bricks') {
                    (col as Bricks).hit(this.tank);
                }
            });

            this.spriteVisible(1, false);
            this.spriteVisible(2, true);
            this.spriteState(2, 'explode', AnimationType.ANIMATE_TO_HIDE);

        }

    }



}