import Engine2d from "../engine/Engine2d";

export default class BattleCity{
    private engine : Engine2d;
    private readyCallback: any;

    constructor(canvas: any){

        this.engine = new Engine2d(30);
        this.engine.init('./assets/sprites.json', canvas, 480,480, ()=>{

        });

    }

    setMap(url:string):void {

    }

    inputAssign(code: number, action: string):void {

    }

    onReady(callback: any):void {
       this.readyCallback = callback;
    }

}