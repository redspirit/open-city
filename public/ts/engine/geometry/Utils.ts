
export default class Utils{

    static snapToGrid(a:number, cellSize:number):number {
        return Math.round(a / cellSize) * cellSize;
    }

}