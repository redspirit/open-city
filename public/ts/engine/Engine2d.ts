import {loader} from "./Loader";
import {containers} from "./Containers";
import Container from "./Container";

export enum AnimationType { STATIC, ANIMATE_REPEAT, ANIMATE_TO_END, ANIMATE_TO_HIDE }

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
    private scene:any = {};

    constructor(fps: number){

        this.fpsInterval = 1000 / fps;
        this.animThen = Date.now();
        this.startTime = this.animThen;
        this.animNow = 0;
        this.animElapsed = 0;
        this.animate();

        this.scene.ctx = null;
        this.scene.width = 0;
        this.scene.height = 0;

    }

    public init(configUrl:string, canvas:any, width:number, height:number, cb:any):void {

        if (canvas.getContext){
            this.scene.ctx = canvas.getContext('2d');
            this.scene.ctx.imageSmoothingEnabled = false;
            this.scene.width = width;
            this.scene.height = height;

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

    public onUpdate(callback: any):void {
        this.updateCallback = callback;
    }

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

    private render():void {

        this.scene.ctx.clearRect(0, 0, this.scene.width, this.scene.height);

        containers.render(this.scene);

    }

}