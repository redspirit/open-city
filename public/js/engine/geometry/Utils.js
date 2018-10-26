System.register([], function (exports_1, context_1) {
    "use strict";
    var Utils;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Utils = /** @class */ (function () {
                function Utils() {
                }
                Utils.snapToGrid = function (a, cellSize) {
                    return Math.round(a / cellSize) * cellSize;
                };
                return Utils;
            }());
            exports_1("default", Utils);
        }
    };
});
