
export default class Point{
    x : number;
    y : number;

    constructor(x:number, y: number){
        this.x = x;
        this.y = y;
    }

    distanceTo(p:Point):number {
        let a:number = this.x - p.x;
        let b:number = this.y - p.y;
        return Math.sqrt(a*a + b*b);
    }

}