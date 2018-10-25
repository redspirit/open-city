
import Box from "./Box";

export default class Rect{
    x : number;
    y : number;
    w : number;
    h : number;

    constructor(x: number, y: number, w: number, h: number){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    isCollided(rect:Rect):boolean {
        return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
            this.y < rect.y + rect.h && this.h + this.y > rect.y;
    }

    toBox():Box {
        return new Box(this.x, this.y, this.w + this.x, this.h + this.y);
    }

}