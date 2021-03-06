import {Engine2d} from "../engine/Engine2d";
import {mapBuilder} from "./MapBuilder";
import {Rect} from "../engine/geometry/Rect";
import Container from "../engine/Container";
import {input, InputAction} from "./Input";
import Tank from "./Actors/Tank";
import Point from "../engine/geometry/Point";
import Bullet from "./Actors/Bullet";

export default class BattleCity{
    private engine : Engine2d;
    private readyCallback: any;

    public player:any; //Tank
    public myBullet:any; //Bullet

    constructor(canvas: any){

        this.engine = new Engine2d(30);
        this.engine.init('./assets/sprites.json', canvas, 480,480, ()=>{
            this.readyCallback && this.readyCallback();
            this.reset();
        });

        this.engine.onUpdate(() => {
            this.update();
        });

        input.onPressed((command:InputAction) => {

            if(command === InputAction.FIRE) {
                this.player.fire(this.myBullet);
            }

            if(command === InputAction.RESET) {
                this.player.setProtect(5000);
            }

        });
        input.onReleased(function (command:InputAction) {

        });

    }

    public loadMap(url:string):void {
        mapBuilder.buildFromFile(url);
    }

    public inputAssign(code:number, command:InputAction):void {
        input.assign(code, command);
    };

    public reset() {

        this.player = new Tank().spawn(new Point(160, 416));
        this.myBullet = new Bullet();

        // walls
        new Container(new Rect(0, 0, 480, 32)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(0, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(448, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(0, 448, 480, 32)).fillColor('gray').setCollisionGroup('wall');

    }

    private update():void {

        this.player.update();
        this.myBullet.update();

    }


    onReady(callback: any):void {
       this.readyCallback = callback;
    }

}