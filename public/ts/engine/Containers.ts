
import Container from "./Container";
import Sprite from "./Sprite";
import {AnimationType, State} from "./Engine2d";
import {Rect} from "./geometry/Rect";
import Point from "./geometry/Point";


class Containers {

    public containers: Container[] = [];

    public getAll() {
        return this.containers;
    }

    public add(c:Container) {
        this.containers.push(c);
        return this;
    }

    public getByName(id:string) {
        return this.containers.filter((c:Container) => {
            return c.name === name;
        })[0];
    }

    public sortByIndex () {
        this.containers = this.containers.sort((a:Container, b:Container) => {
            if (a.zIndex > b.zIndex) return 1;
            if (a.zIndex < b.zIndex) return -1;
            return 0;
        });
    }

    public render(scene:any):void {

        this.containers.forEach((container:Container) => {

            if (!container.visible)
                return false;

            if (container.color) {
                scene.ctx.fillStyle = container.color;
                scene.ctx.fillRect(container.rect.x, container.rect.y, container.rect.w, container.rect.h);
            }

            let sprites = container.getSprites();
            Object.keys(sprites).forEach((spriteId) => {

                let sprite = sprites[spriteId];
                if (!sprite.visible)
                    return false;

                this.renderSprite(sprite, container, scene);

            });

        });

    }

    private renderSprite(sprite:Sprite, container:Container, scene:any) {

        let viewPortX = Infinity;
        let viewPortY = Infinity;
        let skiping = sprite.state ? (sprite.state.speed || 0) : 0;
        let rect:Rect;

        if(sprite.noStates) sprite.animationType = AnimationType.STATIC;

        if(sprite.animationType === AnimationType.STATIC) {
            if(sprite.noStates) {
                rect = sprite.rects[0];
            } else {
                rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
            }
        }
        if(sprite.animationType === AnimationType.ANIMATE_REPEAT) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.animationCurrentFrame = 0;
            }
            sprite.animationSkipFrames++;

        }
        if(sprite.animationType === AnimationType.ANIMATE_TO_END) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.animationCurrentFrame = sprite.state.frames.length - 1;
            }
            sprite.animationSkipFrames++;

        }
        if(sprite.animationType === AnimationType.ANIMATE_TO_HIDE) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.visible = false;
            }
            sprite.animationSkipFrames++;

        }

        sprite.positions.forEach(function (pos:Point) {

            if(sprite.noStates) {
                let rectIndex = pos.extra || 0;
                rect = sprite.rects[rectIndex];
            }

            if(container.overflow) {
                viewPortX = (container.rect.w - pos.x) / sprite.scale;
                viewPortY = (container.rect.h - pos.y) / sprite.scale;
            }

            // console.log('>>>>>>>>', rect);

            scene.ctx.drawImage(
                sprite.img,
                rect.x,     // source x
                rect.y,     // source y
                Math.min(rect.w, viewPortX),     // sprite w
                Math.min(rect.h, viewPortY),     // sprite h
                pos.x + container.rect.x,
                pos.y + container.rect.y,
                Math.min(rect.w, viewPortX) * sprite.scale,
                Math.min(rect.h, viewPortY) * sprite.scale
            );

        });


    }

}

export let containers:Containers = new Containers();