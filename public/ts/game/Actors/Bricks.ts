import Container from "../../engine/Container";
import Point from "../../engine/geometry/Point";


export default class Bricks extends Container {

    private parts: boolean[];


    constructor(p:Point) {

        super(p.toRect(16, 16));

        this.addSprite(1, 'bricks', []).setCollisionGroup('bricks');

        this.parts = [true, true, true, true];
        this.setParts();

    }

    public setParts():void {
        let positions = [];
        if(this.parts[0]) positions.push(new Point(0,0,0));
        if(this.parts[1]) positions.push(new Point(8,0,1));
        if(this.parts[2]) positions.push(new Point(8,8,0));
        if(this.parts[3]) positions.push(new Point(0,8,1));
        this.spritePositions(1, positions);

        // let box = new Bbox();
        // positions.forEach(function (pos) {
        //     box.extendBox([pos[0], pos[1], 8, 8]);
        // });
        //
        // let r = box.result();
        //
        // container.changeSize(r[0], r[1], r[1], r[2]);
        // console.log(r);
    };

    public hit(side:number) {

        if(side === 1) {
            this.parts[0] = false;
            this.parts[1] = false;
        }
        if(side === 2) {
            this.parts[1] = false;
            this.parts[2] = false;
        }
        if(side === 3) {
            this.parts[2] = false;
            this.parts[3] = false;
        }
        if(side === 4) {
            this.parts[0] = false;
            this.parts[3] = false;
        }

        this.setParts();

    };

}