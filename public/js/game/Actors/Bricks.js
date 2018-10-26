System.register(["../../engine/Container", "../../engine/geometry/Point"], function (exports_1, context_1) {
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
    var Container_1, Point_1, Bricks;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Container_1_1) {
                Container_1 = Container_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            }
        ],
        execute: function () {
            Bricks = /** @class */ (function (_super) {
                __extends(Bricks, _super);
                function Bricks(p) {
                    var _this = _super.call(this, p.toRect(16, 16)) || this;
                    _this.addSprite(1, 'bricks', []).setCollisionGroup('bricks');
                    _this.parts = [true, true, true, true];
                    _this.setParts();
                    return _this;
                }
                Bricks.prototype.setParts = function () {
                    var positions = [];
                    if (this.parts[0])
                        positions.push(new Point_1.default(0, 0, 0));
                    if (this.parts[1])
                        positions.push(new Point_1.default(8, 0, 1));
                    if (this.parts[2])
                        positions.push(new Point_1.default(8, 8, 0));
                    if (this.parts[3])
                        positions.push(new Point_1.default(0, 8, 1));
                    this.spritePositions(1, positions);
                    // let box = new Bbox();
                    // positions.forEach(function (pos) {
                    //     box.extendBox([pos[0], pos[1], 8, 8]);
                    // });
                    //
                    // let r = box.result();
                    //
                    // container.changeSize(r[0], r[1], r[1], r[2]);
                    // console.log(r);
                };
                ;
                Bricks.prototype.hit = function (side) {
                    if (side === 1) {
                        this.parts[0] = false;
                        this.parts[1] = false;
                    }
                    if (side === 2) {
                        this.parts[1] = false;
                        this.parts[2] = false;
                    }
                    if (side === 3) {
                        this.parts[2] = false;
                        this.parts[3] = false;
                    }
                    if (side === 4) {
                        this.parts[0] = false;
                        this.parts[3] = false;
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
