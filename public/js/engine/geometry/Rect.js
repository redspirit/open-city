System.register(["./Box", "./Point"], function (exports_1, context_1) {
    "use strict";
    var Box_1, Point_1, RectSide, Rect;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            }
        ],
        execute: function () {
            (function (RectSide) {
                RectSide[RectSide["TOP"] = 0] = "TOP";
                RectSide[RectSide["RIGHT"] = 1] = "RIGHT";
                RectSide[RectSide["BOTTOM"] = 2] = "BOTTOM";
                RectSide[RectSide["LEFT"] = 3] = "LEFT";
            })(RectSide || (RectSide = {}));
            exports_1("RectSide", RectSide);
            ;
            Rect = (function () {
                function Rect(x, y, w, h) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                }
                Rect.prototype.setChild = function (child) {
                    this._child = child;
                };
                Rect.prototype.getChild = function () {
                    return this._child;
                };
                Rect.prototype.isCollided = function (rect) {
                    return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
                        this.y < rect.y + rect.h && this.h + this.y > rect.y;
                };
                Rect.prototype.toBox = function () {
                    return new Box_1.default(this.x, this.y, this.w + this.x, this.h + this.y);
                };
                Rect.prototype.getSizeByTarget = function (p) {
                    var cx = this.x + this.w / 2;
                    var cy = this.y + this.h / 2;
                    var dx = cx - p.x;
                    var dy = cy - p.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        return dx > 0 ? RectSide.LEFT : RectSide.RIGHT;
                    }
                    else {
                        return dy > 0 ? RectSide.TOP : RectSide.BOTTOM;
                    }
                };
                Rect.prototype.getCollisionDetails = function (rect2) {
                    if (!this.isCollided(rect2)) {
                        return {
                            isCollided: false
                        };
                    }
                    var colResult = this.toBox().calcCollidedArea(rect2.toBox());
                    return {
                        isCollided: true,
                        collidedBox: colResult.box,
                        collidedRect: colResult.rect,
                    };
                };
                Rect.prototype.toPoint = function () {
                    return new Point_1.default(this.x, this.y);
                };
                Rect.prototype.getCenter = function () {
                    return new Point_1.default(this.x + this.w / 2, this.y + this.h / 2);
                };
                ;
                return Rect;
            }());
            exports_1("Rect", Rect);
        }
    };
});
