import Rect from "./Rect";

export default class Point{
    x : number;
    y : number;
    extra : number;

    constructor(x:number, y: number, extra:number = 0){
        this.x = x;
        this.y = y;
        this.extra = extra;
    }

    distanceTo(p:Point):number {
        let a:number = this.x - p.x;
        let b:number = this.y - p.y;
        return Math.sqrt(a*a + b*b);
    }

    toRect(w:number, h:number):Rect {
        return new Rect(this.x, this.y, w, h);
    }

}