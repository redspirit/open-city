System.register(["./Engine2d"], function (exports_1, context_1) {
    "use strict";
    var Engine2d_1, Containers, containers;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            }
        ],
        execute: function () {
            Containers = /** @class */ (function () {
                function Containers() {
                    this.containers = [];
                }
                Containers.prototype.getAll = function () {
                    return this.containers;
                };
                Containers.prototype.add = function (c) {
                    this.containers.push(c);
                    return this;
                };
                Containers.prototype.getByName = function (id) {
                    return this.containers.filter(function (c) {
                        return c.name === name;
                    })[0];
                };
                Containers.prototype.sortByIndex = function () {
                    this.containers = this.containers.sort(function (a, b) {
                        if (a.zIndex > b.zIndex)
                            return 1;
                        if (a.zIndex < b.zIndex)
                            return -1;
                        return 0;
                    });
                };
                Containers.prototype.render = function (scene) {
                    var _this = this;
                    this.containers.forEach(function (container) {
                        if (!container.visible)
                            return false;
                        if (container.color) {
                            scene.ctx.fillStyle = container.color;
                            scene.ctx.fillRect(container.rect.x, container.rect.y, container.rect.w, container.rect.h);
                        }
                        var sprites = container.getSprites();
                        Object.keys(sprites).forEach(function (spriteId) {
                            var sprite = sprites[spriteId];
                            if (!sprite.visible)
                                return false;
                            _this.renderSprite(sprite, container, scene);
                        });
                    });
                };
                Containers.prototype.renderSprite = function (sprite, container, scene) {
                    var viewPortX = Infinity;
                    var viewPortY = Infinity;
                    var skiping = sprite.state ? (sprite.state.speed || 0) : 0;
                    var rect;
                    if (sprite.noStates)
                        sprite.animationType = Engine2d_1.AnimationType.STATIC;
                    if (sprite.animationType === Engine2d_1.AnimationType.STATIC) {
                        if (sprite.noStates) {
                            rect = sprite.rects[0];
                        }
                        else {
                            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
                        }
                    }
                    if (sprite.animationType === Engine2d_1.AnimationType.ANIMATE_REPEAT) {
                        rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
                        if (sprite.animationSkipFrames === skiping) {
                            sprite.animationSkipFrames = 0;
                            sprite.animationCurrentFrame++;
                            if (sprite.animationCurrentFrame === sprite.state.frames.length)
                                sprite.animationCurrentFrame = 0;
                        }
                        sprite.animationSkipFrames++;
                    }
                    if (sprite.animationType === Engine2d_1.AnimationType.ANIMATE_TO_END) {
                        rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
                        if (sprite.animationSkipFrames === skiping) {
                            sprite.animationSkipFrames = 0;
                            sprite.animationCurrentFrame++;
                            if (sprite.animationCurrentFrame === sprite.state.frames.length)
                                sprite.animationCurrentFrame = sprite.state.frames.length - 1;
                        }
                        sprite.animationSkipFrames++;
                    }
                    if (sprite.animationType === Engine2d_1.AnimationType.ANIMATE_TO_HIDE) {
                        rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
                        if (sprite.animationSkipFrames === skiping) {
                            sprite.animationSkipFrames = 0;
                            sprite.animationCurrentFrame++;
                            if (sprite.animationCurrentFrame === sprite.state.frames.length)
                                sprite.visible = false;
                        }
                        sprite.animationSkipFrames++;
                    }
                    sprite.positions.forEach(function (pos) {
                        if (!sprite.state) {
                            //let rectIndex = pos.extra || 0;
                            //rect = sprite.rects[rectIndex];
                        }
                        if (container.overflow) {
                            viewPortX = (container.rect.w - pos.x) / sprite.scale;
                            viewPortY = (container.rect.h - pos.y) / sprite.scale;
                        }
                        // console.log('>>>>>>>>', rect);
                        scene.ctx.drawImage(sprite.img, rect.x, // source x
                        rect.y, // source y
                        Math.min(rect.w, viewPortX), // sprite w
                        Math.min(rect.h, viewPortY), // sprite h
                        pos.x + container.rect.x, pos.y + container.rect.y, Math.min(rect.w, viewPortX) * sprite.scale, Math.min(rect.h, viewPortY) * sprite.scale);
                    });
                };
                return Containers;
            }());
            exports_1("containers", containers = new Containers());
        }
    };
});
