System.register([], function (exports_1, context_1) {
    "use strict";
    var Loader;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Loader = /** @class */ (function () {
                function Loader() {
                    this.configUrl = '';
                }
                Loader.prototype.load = function (url, callback) {
                    var _this = this;
                    this.configUrl = url;
                    this.loadConfigFile(function () {
                        _this.loadBitmaps(function () {
                            callback(_this.configData);
                        });
                    });
                };
                Loader.prototype.loadConfigFile = function (cb) {
                    var _this = this;
                    var oReq = new XMLHttpRequest();
                    oReq.onload = function () {
                        _this.configData = JSON.parse(oReq.responseText);
                        cb && cb();
                    };
                    oReq.open("get", this.configUrl, true);
                    oReq.send();
                };
                Loader.prototype.loadBitmaps = function (cb) {
                    var loadedCount = 0;
                    var total = this.configData.bitmaps.length;
                    this.configData.bitmaps.forEach(function (bitmap) {
                        bitmap.img = new Image();
                        bitmap.img.addEventListener("load", function () {
                            loadedCount++;
                            if (loadedCount === total) {
                                cb();
                            }
                        }, false);
                        bitmap.img.src = bitmap.url;
                    });
                };
                return Loader;
            }());
            exports_1("default", Loader);
        }
    };
});
