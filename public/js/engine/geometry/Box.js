System.register(["./Rect"], function (exports_1, context_1) {
    "use strict";
    var Rect_1, Box;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            }
        ],
        execute: function () {
            Box = /** @class */ (function () {
                function Box(x, y, x2, y2) {
                    this.x = x;
                    this.y = y;
                    this.x2 = x2;
                    this.y2 = y2;
                }
                Box.prototype.isCollided = function (box) {
                    return this.x < box.x2 && this.x2 > box.x &&
                        this.y < box.y2 && this.y2 > box.y;
                };
                Box.prototype.toRect = function () {
                    return new Rect_1.default(this.x, this.y, this.x2 - this.x, this.y2 - this.y);
                };
                return Box;
            }());
            exports_1("default", Box);
        }
    };
});
