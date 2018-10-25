System.register(["./Box"], function (exports_1, context_1) {
    "use strict";
    var Box_1, Rect;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Box_1_1) {
                Box_1 = Box_1_1;
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
                return Rect;
            }());
            exports_1("default", Rect);
        }
    };
});
