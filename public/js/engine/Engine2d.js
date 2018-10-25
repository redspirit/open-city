System.register(["./Loader", "./Containers"], function (exports_1, context_1) {
    "use strict";
    var Loader_1, Containers_1, AnimationType, State, Engine2d;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Loader_1_1) {
                Loader_1 = Loader_1_1;
            },
            function (Containers_1_1) {
                Containers_1 = Containers_1_1;
            }
        ],
        execute: function () {
            (function (AnimationType) {
                AnimationType[AnimationType["STATIC"] = 0] = "STATIC";
                AnimationType[AnimationType["ANIMATE_REPEAT"] = 1] = "ANIMATE_REPEAT";
                AnimationType[AnimationType["ANIMATE_TO_END"] = 2] = "ANIMATE_TO_END";
                AnimationType[AnimationType["ANIMATE_TO_HIDE"] = 3] = "ANIMATE_TO_HIDE";
            })(AnimationType || (AnimationType = {}));
            exports_1("AnimationType", AnimationType);
            State = /** @class */ (function () {
                function State(name, frames, speed) {
                    if (name === void 0) { name = ''; }
                    if (frames === void 0) { frames = []; }
                    if (speed === void 0) { speed = 0; }
                    this.name = name;
                    this.frames = frames;
                    this.speed = speed;
                }
                return State;
            }());
            exports_1("State", State);
            Engine2d = /** @class */ (function () {
                function Engine2d(fps) {
                    // resources properties
                    this.resourcesLoaded = false;
                    // scene
                    this.scene = {};
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
                Engine2d.prototype.init = function (configUrl, canvas, width, height, cb) {
                    var _this = this;
                    if (canvas.getContext) {
                        this.scene.ctx = canvas.getContext('2d');
                        this.scene.ctx.imageSmoothingEnabled = false;
                        this.scene.width = width;
                        this.scene.height = height;
                        Loader_1.loader.load(configUrl, function (configData) {
                            _this.configData = configData;
                            _this.resourcesLoaded = true;
                            console.log('configData', configData);
                            cb && cb();
                        });
                    }
                    else {
                        console.error('canvas unsupported');
                    }
                };
                ;
                Engine2d.prototype.onUpdate = function (callback) {
                    this.updateCallback = callback;
                };
                Engine2d.prototype.animate = function () {
                    var _this = this;
                    requestAnimationFrame(function () {
                        _this.animate();
                    });
                    this.animNow = Date.now();
                    this.animElapsed = this.animNow - this.animThen;
                    if (this.animElapsed > this.fpsInterval) {
                        this.animThen = this.animNow - (this.animElapsed % this.fpsInterval);
                        if (this.resourcesLoaded) {
                            this.updateCallback && this.updateCallback();
                            this.render();
                        }
                    }
                };
                Engine2d.prototype.render = function () {
                    this.scene.ctx.clearRect(0, 0, this.scene.width, this.scene.height);
                    Containers_1.containers.render(this.scene);
                };
                return Engine2d;
            }());
            exports_1("Engine2d", Engine2d);
        }
    };
});
