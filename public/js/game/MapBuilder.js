System.register(["../engine/Container", "../engine/geometry/Rect", "../engine/geometry/Point", "./Actors/Bricks"], function (exports_1, context_1) {
    "use strict";
    var Container_1, Rect_1, Point_1, Bricks_1, MapBuilder, mapBuilder;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Container_1_1) {
                Container_1 = Container_1_1;
            },
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Bricks_1_1) {
                Bricks_1 = Bricks_1_1;
            }
        ],
        execute: function () {
            MapBuilder = /** @class */ (function () {
                function MapBuilder() {
                }
                MapBuilder.prototype.buildFromFile = function (url) {
                    var _this = this;
                    this.loadFromFile(url, function (map) {
                        _this.buildFromMap(map);
                    });
                };
                MapBuilder.prototype.buildFromMap = function (map) {
                    var cols = -1;
                    var rows = -1;
                    map.forEach(function (row) {
                        rows += 1;
                        cols = -1;
                        row.forEach(function (index) {
                            cols += 1;
                            var x = cols * 16 + 32;
                            var y = rows * 16 + 32;
                            if (index === 1) {
                                new Bricks_1.default(new Point_1.default(x, y));
                            }
                            if (index === 2) {
                                new Container_1.default(new Rect_1.Rect(x, y, 16, 16))
                                    .addSprite(1, 'iron', [new Point_1.default(0, 0)])
                                    .setCollisionGroup('block');
                            }
                            if (index === 3) {
                                new Container_1.default(new Rect_1.Rect(x, y, 16, 16))
                                    .addSprite(1, 'grass', [new Point_1.default(0, 0)])
                                    .setZIndex(15);
                            }
                            if (index === 4) {
                                new Container_1.default(new Rect_1.Rect(x, y, 16, 16))
                                    .addSprite(1, 'ice', [new Point_1.default(0, 0)]);
                            }
                            if (index === 5) {
                                new Container_1.default(new Rect_1.Rect(x, y, 16, 16))
                                    .addSprite(1, 'water', [new Point_1.default(0, 0)])
                                    .spriteState(1, 'idle')
                                    .setCollisionGroup('block')
                                    .setName('water');
                            }
                            if (index === 6) {
                                new Container_1.default(new Rect_1.Rect(x, y, 16, 16))
                                    .addSprite(1, 'eagle', [new Point_1.default(0, 0)])
                                    .spriteState(1, 'live')
                                    .setCollisionGroup('block');
                            }
                        });
                    });
                };
                MapBuilder.prototype.loadFromFile = function (mapUrl, cb) {
                    if (!mapUrl)
                        return console.error('Map URL not defined!');
                    var map = [];
                    var oReq = new XMLHttpRequest();
                    oReq.onload = function () {
                        map = oReq.responseText.split('\n').map(function (item) {
                            return item.split('').filter(function (a) {
                                return a !== '\r';
                            }).map(function (a) {
                                return parseInt(a);
                            });
                        });
                        cb && cb(map);
                    };
                    oReq.open("get", mapUrl, true);
                    oReq.send();
                };
                return MapBuilder;
            }());
            exports_1("mapBuilder", mapBuilder = new MapBuilder());
        }
    };
});
