
import Box from "./Box";
import Point from "./Point";

export enum RectSide {TOP, RIGHT, BOTTOM, LEFT};

export class Rect{
    public x : number;
    public y : number;
    public w : number;
    public h : number;

    private _child:any;

    constructor(x: number, y: number, w: number, h: number){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    public setChild(child:any):void {
        this._child = child;
    }
    public getChild():any {
        return this._child;
    }


    public isCollided(rect:Rect):boolean {
        return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
            this.y < rect.y + rect.h && this.h + this.y > rect.y;
    }

    public toBox():Box {
        return new Box(this.x, this.y, this.w + this.x, this.h + this.y);
    }

    public getSizeByTarget(p:Point):RectSide {

        let cx = this.x + this.w / 2;
        let cy = this.y + this.h / 2;

        let dx = cx - p.x;
        let dy = cy - p.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? RectSide.LEFT : RectSide.RIGHT
        } else {
            return dy > 0 ? RectSide.TOP : RectSide.BOTTOM
        }
    }

    public getCollisionDetails(rect2:Rect){

        if(!this.isCollided(rect2)) {
            return {
                isCollided: false
            }
        }

        //let rect1 = this;

        let colResult = this.toBox().calcCollidedArea(rect2.toBox());
        // let box = colResult.rect;
        //
        // let targetCorner = 0;
        // let sourceCorner = 0;
        // let targetSide = 0;
        //
        // let rect = [box[0], box[1], box[2]-box[0], box[3]-box[1]];
        // let relativeRect = [rect[0] - this.x, rect[1] - this.y, rect[2], rect[3]];
        //
        // if(box[0] === rect2[0] && box[1] === rect2[1]) targetCorner = 1;    // left top
        // if(box[2] === rect2[2] && box[1] === rect2[1]) targetCorner = 2;    // right top
        // if(box[2] === rect2[2] && box[3] === rect2[3]) targetCorner = 3;    // right bottom
        // if(box[0] === rect2[0] && box[3] === rect2[3]) targetCorner = 4;    // left bottom
        //
        // if(rect1[0] === box[0] && rect1[1] === box[1]) sourceCorner = 1;
        // if(rect1[2] === box[2] && rect1[1] === box[1]) sourceCorner = 2;
        // if(rect1[2] === box[2] && rect1[3] === box[3]) sourceCorner = 3;
        // if(rect1[0] === box[0] && rect1[3] === box[3]) sourceCorner = 4;

        return {
            isCollided: true,
            collidedBox: colResult.box,
            collidedRect: colResult.rect,
            // relativeRect: relativeRect,
            // targetCorner: targetCorner,
            // sourceCorner: sourceCorner
        }
    }

    public toPoint():Point {
        return new Point(this.x, this.y);
    }

    public getCenter():Point {
        return new Point(this.x + this.w / 2, this.y + this.h / 2);
    };

}