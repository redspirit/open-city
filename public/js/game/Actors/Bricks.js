System.register(["../../engine/Container", "../../engine/geometry/Point", "../../engine/geometry/Rect"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Container_1, Point_1, Rect_1, Part, sides, Bricks;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Container_1_1) {
                Container_1 = Container_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            }
        ],
        execute: function () {
            (function (Part) {
                Part[Part["TopLeft"] = 0] = "TopLeft";
                Part[Part["TopRight"] = 1] = "TopRight";
                Part[Part["BottomLeft"] = 2] = "BottomLeft";
                Part[Part["BottomRight"] = 3] = "BottomRight";
            })(Part || (Part = {}));
            sides = [];
            sides[Rect_1.RectSide.TOP] = [[Part.TopLeft, Part.TopRight], [Part.BottomLeft, Part.BottomRight]];
            sides[Rect_1.RectSide.RIGHT] = [[Part.TopRight, Part.BottomRight], [Part.TopLeft, Part.BottomLeft]];
            sides[Rect_1.RectSide.BOTTOM] = [[Part.BottomLeft, Part.BottomRight], [Part.TopLeft, Part.TopRight]];
            sides[Rect_1.RectSide.LEFT] = [[Part.TopLeft, Part.BottomLeft], [Part.TopRight, Part.BottomRight]];
            Bricks = (function (_super) {
                __extends(Bricks, _super);
                function Bricks(p) {
                    var _this = _super.call(this, p.toRect(16, 16)) || this;
                    _this.parts = [];
                    _this.addSprite(1, 'bricks', []).setCollisionGroup('bricks');
                    _this.parts[Part.TopLeft] = true;
                    _this.parts[Part.TopRight] = true;
                    _this.parts[Part.BottomLeft] = true;
                    _this.parts[Part.BottomRight] = true;
                    _this.setParts();
                    return _this;
                }
                Bricks.prototype.setParts = function () {
                    var positions = [];
                    if (this.parts[Part.TopLeft])
                        positions.push(new Point_1.default(0, 0, 0));
                    if (this.parts[Part.TopRight])
                        positions.push(new Point_1.default(8, 0, 1));
                    if (this.parts[Part.BottomLeft])
                        positions.push(new Point_1.default(0, 8, 1));
                    if (this.parts[Part.BottomRight])
                        positions.push(new Point_1.default(8, 8, 0));
                    if (positions.length > 0) {
                        this.spritePositions(1, positions);
                    }
                    else {
                        this.setVisible(false);
                    }
                };
                ;
                Bricks.prototype.hit = function (tank) {
                    var center = tank.rect.getCenter();
                    var side = this.rect.getSizeByTarget(center);
                    var curSide = sides[side];
                    if (this.parts[curSide[0][0]] || this.parts[curSide[0][1]]) {
                        this.parts[curSide[0][0]] = false;
                        this.parts[curSide[0][1]] = false;
                    }
                    else {
                        if (this.parts[curSide[1][0]] || this.parts[curSide[1][1]]) {
                            this.parts[curSide[1][0]] = false;
                            this.parts[curSide[1][1]] = false;
                        }
                    }
                    this.setParts();
                };
                ;
                return Bricks;
            }(Container_1.default));
            exports_1("default", Bricks);
        }
    };
});
