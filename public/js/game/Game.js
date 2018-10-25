System.register(["../engine/Engine2d"], function (exports_1, context_1) {
    "use strict";
    var Engine2d_1, BattleCity;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            }
        ],
        execute: function () {
            BattleCity = /** @class */ (function () {
                function BattleCity(canvas) {
                    this.engine = new Engine2d_1.default(30);
                    this.engine.init('./assets/sprites.json', canvas, 480, 480, function () {
                    });
                }
                BattleCity.prototype.setMap = function (url) {
                };
                BattleCity.prototype.inputAssign = function (code, action) {
                };
                BattleCity.prototype.onReady = function (callback) {
                    this.readyCallback = callback;
                };
                return BattleCity;
            }());
            exports_1("default", BattleCity);
        }
    };
});
