System.register(["./Loader"], function (exports_1, context_1) {
    "use strict";
    var Loader_1, Engine2d;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Loader_1_1) {
                Loader_1 = Loader_1_1;
            }
        ],
        execute: function () {
            Engine2d = /** @class */ (function () {
                function Engine2d(fps) {
                    // resources properties
                    this.resourcesLoaded = false;
                    this.loader = new Loader_1.default();
                    // scene
                    this.sceneCtx = null;
                    this.sceneWidth = 0;
                    this.sceneHeight = 0;
                    this.fpsInterval = 1000 / fps;
                    this.animThen = Date.now();
                    this.startTime = this.animThen;
                    this.animNow = 0;
                    this.animElapsed = 0;
                    this.animate();
                }
                Engine2d.prototype.init = function (configUrl, canvas, width, height, cb) {
                    var _this = this;
                    if (canvas.getContext) {
                        this.sceneCtx = canvas.getContext('2d');
                        this.sceneCtx.imageSmoothingEnabled = false;
                        this.sceneWidth = width;
                        this.sceneHeight = height;
                        this.loader.load(configUrl, function (configData) {
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
                    //console.log('render');
                };
                return Engine2d;
            }());
            exports_1("default", Engine2d);
        }
    };
});
