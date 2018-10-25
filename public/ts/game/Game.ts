import {Engine2d} from "../engine/Engine2d";
import {mapBuilder} from "./MapBuilder";
import Rect from "../engine/geometry/Rect";
import Container from "../engine/Container";
import {containers} from "../engine/Containers";

export default class BattleCity{
    private engine : Engine2d;
    private readyCallback: any;


    constructor(canvas: any){

        this.engine = new Engine2d(30);
        this.engine.init('./assets/sprites.json', canvas, 480,480, ()=>{
            this.readyCallback && this.readyCallback();
            this.reset();
        });

        this.engine.onUpdate(() => {
            this.update();
        })

    }

    public loadMap(url:string):void {
        mapBuilder.buildFromFile(url);
    }


    public inputAssign(code: number, action: string):void {

    }

    public reset() {

        // walls
        new Container(new Rect(0, 0, 480, 32)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(0, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(448, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
        new Container(new Rect(0, 448, 480, 32)).fillColor('gray').setCollisionGroup('wall');

    }

    private update():void {


    }


    onReady(callback: any):void {
       this.readyCallback = callback;
    }

}