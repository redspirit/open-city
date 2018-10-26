System.register(["./Rect"], function (exports_1, context_1) {
    "use strict";
    var Rect_1, Point;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            }
        ],
        execute: function () {
            Point = /** @class */ (function () {
                function Point(x, y, extra) {
                    if (extra === void 0) { extra = 0; }
                    this.x = x;
                    this.y = y;
                    this.extra = extra;
                }
                Point.prototype.distanceTo = function (p) {
                    var a = this.x - p.x;
                    var b = this.y - p.y;
                    return Math.sqrt(a * a + b * b);
                };
                Point.prototype.toRect = function (w, h) {
                    return new Rect_1.default(this.x, this.y, w, h);
                };
                Point.prototype.snapToGrid = function (cellW, cellH) {
                    this.x = Math.floor(this.x / cellW) * cellW;
                    this.y = Math.floor(this.y / cellH) * cellH;
                    return this;
                };
                return Point;
            }());
            exports_1("default", Point);
        }
    };
});
