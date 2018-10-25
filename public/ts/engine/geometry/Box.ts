
import Point from "./Point"
import Rect from "./Rect";

export default class Box{
    x : number;
    y : number;
    x2 : number;
    y2: number;

    constructor(x: number, y: number, x2: number, y2: number){
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
    }

    isCollided(box:Box):boolean {
        return this.x < box.x2 && this.x2 > box.x &&
            this.y < box.y2 && this.y2 > box.y;
    }

    toRect():Rect {
        return new Rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
    }

}