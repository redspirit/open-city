System.register(["./Loader", "./Engine2d"], function (exports_1, context_1) {
    "use strict";
    var Loader_1, Engine2d_1, Sprite;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Loader_1_1) {
                Loader_1 = Loader_1_1;
            },
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            }
        ],
        execute: function () {
            Sprite = /** @class */ (function () {
                function Sprite(spriteId) {
                    var _this = this;
                    this.id = '';
                    this.rects = [];
                    this.scale = 1;
                    this.state = new Engine2d_1.State();
                    this.visible = true;
                    this.positions = [];
                    this.animationType = Engine2d_1.AnimationType.ANIMATE_REPEAT;
                    this.animationCurrentFrame = 0;
                    this.animationSkipFrames = 0;
                    this.noStates = true;
                    this.states = {};
                    this.params = this.findSpriteConfig(spriteId);
                    if (this.params) {
                        this.bitmap = this.findBitmap(this.params.bitmap);
                        if (this.bitmap) {
                            this.img = this.bitmap.img;
                            this.id = this.params.id;
                            this.rects = this.params.rects;
                            this.scale = this.params.scale || 1;
                            this.params.states && this.params.states.forEach(function (state) {
                                _this.states[state.name] = new Engine2d_1.State(state.name, state.frames, state.speed);
                                _this.noStates = false;
                            });
                        }
                        else {
                            console.error('Bitmap', this.params.bitmap, 'not found for sprite', spriteId);
                        }
                    }
                    else {
                        console.error('Sprite', spriteId, 'not found');
                    }
                }
                Sprite.prototype.findSpriteConfig = function (id) {
                    return Loader_1.loader.configData['sprites'].filter(function (item) {
                        return item.id === id;
                    })[0];
                };
                Sprite.prototype.findBitmap = function (name) {
                    return Loader_1.loader.configData['bitmaps'].filter(function (bitmap) {
                        return bitmap.name === name;
                    })[0];
                };
                Sprite.prototype.setVisible = function (visible) {
                    this.visible = visible;
                    return this;
                };
                Sprite.prototype.setState = function (name, animationType) {
                    if (this.noStates)
                        return this;
                    this.state = this.states[name];
                    if (animationType)
                        this.animationType = animationType;
                    if (animationType === Engine2d_1.AnimationType.ANIMATE_TO_HIDE || animationType === Engine2d_1.AnimationType.ANIMATE_TO_END) {
                        this.animationCurrentFrame = 0;
                        this.animationSkipFrames = 0;
                    }
                    return this;
                };
                ;
                Sprite.prototype.setPositions = function (points) {
                    this.positions = points;
                    return this;
                };
                Sprite.prototype.setPosition = function (point) {
                    this.positions = [point];
                    return this;
                };
                Sprite.prototype.setScale = function (scale) {
                    this.scale = scale;
                    return this;
                };
                Sprite.prototype.doAnimation = function (animationType) {
                    this.animationType = animationType;
                    return this;
                };
                return Sprite;
            }());
            exports_1("default", Sprite);
        }
    };
});
