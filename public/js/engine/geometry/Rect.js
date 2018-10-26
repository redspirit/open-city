System.register(["./Box", "./Point"], function (exports_1, context_1) {
    "use strict";
    var Box_1, Point_1, Rect;
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
            Rect = /** @class */ (function () {
                function Rect(x, y, w, h) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                }
                Rect.prototype.isCollided = function (rect) {
                    return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
                        this.y < rect.y + rect.h && this.h + this.y > rect.y;
                };
                Rect.prototype.toBox = function () {
                    return new Box_1.default(this.x, this.y, this.w + this.x, this.h + this.y);
                };
                Rect.prototype.getSizeByTarget = function (p) {
                    // top = 1
                    // right = 2
                    // bottom = 3
                    // left = 4
                    var cx = this.x + this.w / 2;
                    var cy = this.y + this.h / 2;
                    var dx = cx - p.x;
                    var dy = cy - p.y;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        return dx > 0 ? 4 : 2;
                    }
                    else {
                        return dy > 0 ? 1 : 3;
                    }
                };
                Rect.prototype.getCollisionDetails = function (rect2) {
                    if (!this.isCollided(rect2)) {
                        return {
                            isCollided: false
                        };
                    }
                    //let rect1 = this;
                    var colResult = this.toBox().calcCollidedArea(rect2.toBox());
                    // let box = colResult.rect;
                    //
                    // let targetCorner = 0;
                    // let sourceCorner = 0;
                    // let targetSide = 0;
                    //
                    // let rect = [box[0], box[1], box[2]-box[0], box[3]-box[1]];
                    // let relativeRect = [rect[0] - this.x, rect[1] - this.y, rect[2], rect[3]];
                    //
                    // if(box[0] === rect2[0] && box[1] === rect2[1]) targetCorner = 1;    // left top
                    // if(box[2] === rect2[2] && box[1] === rect2[1]) targetCorner = 2;    // right top
                    // if(box[2] === rect2[2] && box[3] === rect2[3]) targetCorner = 3;    // right bottom
                    // if(box[0] === rect2[0] && box[3] === rect2[3]) targetCorner = 4;    // left bottom
                    //
                    // if(rect1[0] === box[0] && rect1[1] === box[1]) sourceCorner = 1;
                    // if(rect1[2] === box[2] && rect1[1] === box[1]) sourceCorner = 2;
                    // if(rect1[2] === box[2] && rect1[3] === box[3]) sourceCorner = 3;
                    // if(rect1[0] === box[0] && rect1[3] === box[3]) sourceCorner = 4;
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
            exports_1("default", Rect);
        }
    };
});
