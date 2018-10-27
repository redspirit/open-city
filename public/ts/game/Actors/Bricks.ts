import Container from "../../engine/Container";
import Point from "../../engine/geometry/Point";
import {RectSide} from "../../engine/geometry/Rect";
import Tank from "./Tank";

enum Part {TopLeft, TopRight, BottomLeft, BottomRight}


let sides:any[] = [];
sides[RectSide.TOP] = [[Part.TopLeft, Part.TopRight], [Part.BottomLeft, Part.BottomRight]];
sides[RectSide.RIGHT] = [[Part.TopRight, Part.BottomRight], [Part.TopLeft, Part.BottomLeft]];
sides[RectSide.BOTTOM] = [[Part.BottomLeft, Part.BottomRight], [Part.TopLeft, Part.TopRight]];
sides[RectSide.LEFT] = [[Part.TopLeft, Part.BottomLeft], [Part.TopRight, Part.BottomRight]];

export default class Bricks extends Container {

    private parts: boolean[] = [];


    constructor(p:Point) {

        super(p.toRect(16, 16));
        //this.rect

        this.addSprite(1, 'bricks', []).setCollisionGroup('bricks');

        this.parts[Part.TopLeft] = true;
        this.parts[Part.TopRight] = true;
        this.parts[Part.BottomLeft] = true;
        this.parts[Part.BottomRight] = true;

        this.setParts();

    }

    public setParts():void {
        let positions = [];
        if(this.parts[Part.TopLeft]) positions.push(new Point(0,0,0));
        if(this.parts[Part.TopRight]) positions.push(new Point(8,0,1));
        if(this.parts[Part.BottomLeft]) positions.push(new Point(0,8,1));
        if(this.parts[Part.BottomRight]) positions.push(new Point(8,8,0));

        if(positions.length > 0) {
            this.spritePositions(1, positions);
        } else {
            this.setVisible(false);
        }

    };

    public hit(tank: Tank) {

        let center:Point = tank.rect.getCenter();
        let side:RectSide = this.rect.getSizeByTarget(center);

        let curSide:any = sides[side];

        if(this.parts[curSide[0][0]] || this.parts[curSide[0][1]]) {
            this.parts[curSide[0][0]] = false;
            this.parts[curSide[0][1]] = false;
        } else {

            if(this.parts[curSide[1][0]] || this.parts[curSide[1][1]]) {
                this.parts[curSide[1][0]] = false;
                this.parts[curSide[1][1]] = false;
            }

        }


        this.setParts();

    };

}