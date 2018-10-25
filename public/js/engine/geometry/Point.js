System.register([], function (exports_1, context_1) {
    "use strict";
    var Point;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
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
                return Point;
            }());
            exports_1("default", Point);
        }
    };
});
