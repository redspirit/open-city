System.register(["../engine/Engine2d", "./MapBuilder", "../engine/geometry/Rect", "../engine/Container"], function (exports_1, context_1) {
    "use strict";
    var Engine2d_1, MapBuilder_1, Rect_1, Container_1, BattleCity;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            },
            function (MapBuilder_1_1) {
                MapBuilder_1 = MapBuilder_1_1;
            },
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            },
            function (Container_1_1) {
                Container_1 = Container_1_1;
            }
        ],
        execute: function () {
            BattleCity = /** @class */ (function () {
                function BattleCity(canvas) {
                    var _this = this;
                    this.engine = new Engine2d_1.Engine2d(30);
                    this.engine.init('./assets/sprites.json', canvas, 480, 480, function () {
                        _this.readyCallback && _this.readyCallback();
                        _this.reset();
                    });
                    this.engine.onUpdate(function () {
                        _this.update();
                    });
                }
                BattleCity.prototype.loadMap = function (url) {
                    MapBuilder_1.mapBuilder.buildFromFile(url);
                };
                BattleCity.prototype.inputAssign = function (code, action) {
                };
                BattleCity.prototype.reset = function () {
                    // walls
                    new Container_1.default(new Rect_1.default(0, 0, 480, 32)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.default(0, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.default(448, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.default(0, 448, 480, 32)).fillColor('gray').setCollisionGroup('wall');
                };
                BattleCity.prototype.update = function () {
                };
                BattleCity.prototype.onReady = function (callback) {
                    this.readyCallback = callback;
                };
                return BattleCity;
            }());
            exports_1("default", BattleCity);
        }
    };
});
