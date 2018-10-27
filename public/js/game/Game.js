System.register(["../engine/Engine2d", "./MapBuilder", "../engine/geometry/Rect", "../engine/Container", "./Input", "./Actors/Tank", "../engine/geometry/Point", "./Actors/Bullet"], function (exports_1, context_1) {
    "use strict";
    var Engine2d_1, MapBuilder_1, Rect_1, Container_1, Input_1, Tank_1, Point_1, Bullet_1, BattleCity;
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
            },
            function (Input_1_1) {
                Input_1 = Input_1_1;
            },
            function (Tank_1_1) {
                Tank_1 = Tank_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Bullet_1_1) {
                Bullet_1 = Bullet_1_1;
            }
        ],
        execute: function () {
            BattleCity = (function () {
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
                    Input_1.input.onPressed(function (command) {
                        if (command === Input_1.InputAction.FIRE) {
                            _this.player.fire(_this.myBullet);
                        }
                        if (command === Input_1.InputAction.RESET) {
                            _this.player.setProtect(5000);
                        }
                    });
                    Input_1.input.onReleased(function (command) {
                    });
                }
                BattleCity.prototype.loadMap = function (url) {
                    MapBuilder_1.mapBuilder.buildFromFile(url);
                };
                BattleCity.prototype.inputAssign = function (code, command) {
                    Input_1.input.assign(code, command);
                };
                ;
                BattleCity.prototype.reset = function () {
                    this.player = new Tank_1.default().spawn(new Point_1.default(160, 416));
                    this.myBullet = new Bullet_1.default();
                    new Container_1.default(new Rect_1.Rect(0, 0, 480, 32)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.Rect(0, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.Rect(448, 0, 32, 480)).fillColor('gray').setCollisionGroup('wall');
                    new Container_1.default(new Rect_1.Rect(0, 448, 480, 32)).fillColor('gray').setCollisionGroup('wall');
                };
                BattleCity.prototype.update = function () {
                    this.player.update();
                    this.myBullet.update();
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
