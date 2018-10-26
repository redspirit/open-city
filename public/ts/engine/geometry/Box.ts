
import {Rect} from "./Rect";

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

    public isCollided(box:Box):boolean {
        return this.x < box.x2 && this.x2 > box.x &&
            this.y < box.y2 && this.y2 > box.y;
    }

    public toRect():Rect {
        return new Rect(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
    }

    public getArea():number {
        return Math.abs(this.x - this.x2) * Math.abs(this.y - this.y2);
    }

    public calcCollidedArea (box:Box):any {

        let box2 = this;

        let colBox = new Box(
            Math.max(box.x, box2.x),
            Math.max(box.y, box2.y),
            Math.min(box.x2, box2.x2),
            Math.min(box.y2, box2.y2)
        );

        return {
            rect: colBox.toRect(),
            box: colBox,
            area: colBox.getArea()
        }
    }

}