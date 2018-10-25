import {loader} from "./Loader";

export enum AnimationType { STATIC, ANIMATE_REPEAT, ANIMATE_TO_END, ANIMATE_TO_HIDE };

export class State {
    name:string;
    frames: number[];
    speed: number;
    constructor(name:string = '', frames:number[] = [], speed:number = 0) {
        this.name = name;
        this.frames = frames;
        this.speed = speed;
    }
}

export class Engine2d{

    // FPS properties
    private fpsInterval: number;
    private animThen: number;
    private startTime: number;
    private animNow: number;
    private animElapsed: number;
    private updateCallback:any;

    // resources properties
    private resourcesLoaded:boolean = false;
    private configData:any;

    // scene
    private sceneCtx:any = null;
    private sceneWidth:number = 0;
    private sceneHeight:number = 0;

    constructor(fps: number){

        this.fpsInterval = 1000 / fps;
        this.animThen = Date.now();
        this.startTime = this.animThen;
        this.animNow = 0;
        this.animElapsed = 0;
        this.animate();

    }

    public init(configUrl:string, canvas:any, width:number, height:number, cb:any):void {

        if (canvas.getContext){
            this.sceneCtx = canvas.getContext('2d');
            this.sceneCtx.imageSmoothingEnabled = false;
            this.sceneWidth = width;
            this.sceneHeight = height;

            loader.load(configUrl, (configData:any) => {
                this.configData = configData;
                this.resourcesLoaded = true;
                console.log('configData', configData);
                cb && cb();
            });

        } else {
            console.error('canvas unsupported');
        }

    };

    private animate():void {

        requestAnimationFrame(()=>{
            this.animate();
        });

        this.animNow = Date.now();
        this.animElapsed = this.animNow - this.animThen;

        if (this.animElapsed > this.fpsInterval) {
            this.animThen = this.animNow - (this.animElapsed % this.fpsInterval);

            if(this.resourcesLoaded) {
                this.updateCallback && this.updateCallback();
                this.render();
            }
        }

    }

    render():void {
        //console.log('render');
    }

}