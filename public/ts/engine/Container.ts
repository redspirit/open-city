
import Rect from "./geometry/Rect";
import Sprite from "./Sprite";
import Point from "./geometry/Point";
import {AnimationType} from "./Engine2d";
import {containers} from "./Containers";


export default class Container {


    public rect:Rect;
    public name:string = '';

    public visible:boolean = true;
    public color:string = '';
    private sprites:any = {};
    public overflow:boolean = false;    // скрыть ли все спрайты за пределом контейнера (w, h)
    public collisionGroup:string = '';
    public zIndex:number = 0;

    constructor(rect:Rect, insertToList: boolean = true) {
        this.rect = rect;
        if(insertToList) {
            containers.add(this);
            containers.sortByIndex();
        }
    }

    public setName (name:string) {
        this.name = name;
        return this;
    }
    // this.getParent = function () {
    //     return this.parent;
    // }
    public addSprite(id:number, spriteName:string, positions:Point[]) {
        let sprite = new Sprite(spriteName);
        sprite.setPositions(positions);
        this.sprites[id] = sprite;
        return this;
    }

    public fillColor(color:string) {
        this.color = color;
        return this;
    }
    public setVisible(visible:boolean) {
        this.visible = visible;
        return this;
    }
    public setZIndex(value:number) {
        this.zIndex = value;
        containers.sortByIndex();
        return this;
    }
    public setPosition(point:Point) {
        this.rect.x = Math.round(point.x);
        this.rect.y = Math.round(point.y);
        return this;
    }
    public setRect(rect:Rect) {
        this.rect = rect;
        return this;
    };
    public setOverflow(overflow:boolean) {
        this.overflow = overflow;
        return this;
    }
    public setCollisionGroup(group:string){
        this.collisionGroup = group;
        return this;
    }
    public getSprites() {
        return this.sprites;
    }
    public removeSprite(id:number){
        delete this.sprites[id];
        return this;
    }
    public spriteVisible(id:number, visible:boolean) {
        if(this.sprites[id])
            this.sprites[id].setVisible(visible);
        return this;
    };
    public spritePositions(id:number, positions: Point[]){
        if(this.sprites[id])
            this.sprites[id].setPositions(positions);
        return this;
    }
    public spriteState(id:number, state:string, animationType:AnimationType = AnimationType.ANIMATE_REPEAT){
        if(this.sprites[id])
            this.sprites[id].setState(state, animationType);
        return this;
    }
    public spriteAnimation(id:number, animationType:AnimationType){
        if(this.sprites[id])
            this.sprites[id].doAnimation(animationType);
        return this;
    }

    public findCollidedContainers (excludedGroups:string[] = [], excludedNames:string[] = []) {
        let groups = excludedGroups || [];
        let names = excludedNames || [];
        return containers.getAll().filter((c:Container) => {
            if(!c.collisionGroup) return false;
            if(groups.indexOf(c.collisionGroup) > -1 || names.indexOf(c.name) > -1) return false;
            return this.collisionGroup !== c.collisionGroup && this.rect.isCollided(c.rect);
        });
    };


    public changeSize(innerRect:Rect) {
        // изменить размер контернера указав внутренний бокс

        this.rect.x += innerRect.x;
        this.rect.y += innerRect.y;
        this.rect.w = innerRect.w;
        this.rect.h = innerRect.h;

        Object.keys(this.sprites).forEach((spriteId) => {
            let sprite = this.sprites[spriteId];

            sprite.positions = sprite.positions.map((point:Point) => {
                point.x -= innerRect.x;
                point.y -= innerRect.y;
                return point;
            });

        });

        return this;

    }





}