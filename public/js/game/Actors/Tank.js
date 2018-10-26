System.register(["../../engine/Container", "../../engine/geometry/Point", "../../engine/geometry/Rect"], function (exports_1, context_1) {
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
    var Container_1, Point_1, Rect_1, Tank;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Container_1_1) {
                Container_1 = Container_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            }
        ],
        execute: function () {
            Tank = /** @class */ (function (_super) {
                __extends(Tank, _super);
                function Tank() {
                    var _this = _super.call(this, new Rect_1.default(0, 0, 32, 32)) || this;
                    _this.pos = new Point_1.default(0, 0);
                    return _this;
                }
                return Tank;
            }(Container_1.default));
            exports_1("default", Tank);
        }
    };
});
