import {loader} from "./Loader";
import Rect from "./geometry/Rect";
import Point from "./geometry/Point";
import {AnimationType, State} from "./Engine2d";

export default class Sprite{

    private params:any;
    private bitmap:any;

    public img:any;
    public id:string = '';
    public rects: Rect[] = [];
    public scale:number = 1;
    public state:State = new State();
    public visible:boolean = true;
    public positions: Point[] = [];
    public noStates:boolean = true;
    public animationType:AnimationType = AnimationType.ANIMATE_REPEAT;
    public animationCurrentFrame:number = 0;
    public animationSkipFrames:number = 0;
    private states:any = {};

    constructor(spriteId:string) {

        this.params = this.findSpriteConfig(spriteId);
        if(this.params) {
            this.bitmap = this.findBitmap(this.params.bitmap);
            if(this.bitmap) {

                this.img = this.bitmap.img;
                this.id = this.params.id;
                this.rects = this.params.rects.map((arr:number[]) => {
                    return new Rect(arr[0], arr[1], arr[2], arr[3]);
                });
                this.scale = this.params.scale || 1;

                this.params.states && this.params.states.forEach((state:State) => {
                    this.states[state.name] = new State(state.name, state.frames, state.speed);
                    this.noStates = false;
                });

            } else {
                console.error('Bitmap', this.params.bitmap, 'not found for sprite', spriteId);
            }
        } else {
            console.error('Sprite', spriteId, 'not found');
        }
    }

    private findSpriteConfig(id:string):any {
        return loader.configData['sprites'].filter((item:any) => {
            return item.id === id;
        })[0];
    }

    private findBitmap(name:string):any {
        return loader.configData['bitmaps'].filter(function (bitmap:any) {
            return bitmap.name === name;
        })[0];
    }

    public setVisible(visible:boolean) {
        this.visible = visible;
        return this;
    }

    public setState(name:string, animationType:AnimationType) {
        if(this.noStates)
            return this;
        this.state = this.states[name];
        if(animationType)
            this.animationType = animationType;
        if(animationType === AnimationType.ANIMATE_TO_HIDE || animationType === AnimationType.ANIMATE_TO_END) {
            this.animationCurrentFrame = 0;
            this.animationSkipFrames = 0;
        }
        return this;
    };

    public setPositions(points:Point[]) {
        this.positions = points;
        return this;
    }

    public setPosition(point:Point) {
        this.positions = [point];
        return this;
    }

    public setScale(scale:number) {
        this.scale = scale;
        return this;
    }

    public doAnimation(animationType:AnimationType) {
        this.animationType = animationType;
        return this;
    }

}