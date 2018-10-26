System.register(["../../engine/Container", "../../engine/geometry/Point", "../../engine/geometry/Rect", "../../engine/Engine2d", "../Input", "../../engine/geometry/Utils"], function (exports_1, context_1) {
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
    var Container_1, Point_1, Rect_1, Engine2d_1, Input_1, Utils_1, TankDirection, Tank;
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
            },
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            },
            function (Input_1_1) {
                Input_1 = Input_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            }
        ],
        execute: function () {
            (function (TankDirection) {
                TankDirection[TankDirection["UP"] = 0] = "UP";
                TankDirection[TankDirection["DOWN"] = 1] = "DOWN";
                TankDirection[TankDirection["LEFT"] = 2] = "LEFT";
                TankDirection[TankDirection["RIGHT"] = 3] = "RIGHT";
                TankDirection[TankDirection["STAY"] = 4] = "STAY";
            })(TankDirection || (TankDirection = {}));
            Tank = /** @class */ (function (_super) {
                __extends(Tank, _super);
                function Tank() {
                    var _this = _super.call(this, new Rect_1.Rect(0, 0, 32, 32)) || this;
                    // private pos: Point;
                    _this.speed = 2.5;
                    _this.direction = TankDirection.UP;
                    // this.pos = new Point(0,0);
                    _this.addSprite(1, 'tank_1', [new Point_1.default(0, 0)])
                        .spriteState(1, 'up', Engine2d_1.AnimationType.STATIC)
                        .setCollisionGroup('player1')
                        .setZIndex(10)
                        .setVisible(false);
                    return _this;
                }
                Tank.prototype.spawn = function (start) {
                    // this.pos = start;
                    this.setPosition(start);
                    this.setVisible(true);
                    return this;
                };
                ;
                Tank.prototype.fire = function (bullet) {
                    var offset = new Point_1.default(0, 0);
                    bullet.tank = this;
                    // позиционируем пулю относительно танка
                    if (this.direction === TankDirection.UP) {
                        offset.x = 12;
                        offset.y = 0;
                    }
                    if (this.direction === TankDirection.DOWN) {
                        offset.x = 12;
                        offset.y = 24;
                    }
                    if (this.direction === TankDirection.LEFT) {
                        offset.x = 0;
                        offset.y = 12;
                    }
                    if (this.direction === TankDirection.RIGHT) {
                        offset.x = 24;
                        offset.y = 12;
                    }
                    bullet.start(new Point_1.default(this.rect.x, this.rect.y).plus(offset), this.direction);
                    return this;
                };
                ;
                Tank.prototype.update = function () {
                    var oldPos = this.rect.toPoint();
                    var dir;
                    var oldDirection = this.direction;
                    if (Input_1.input.isPressed(Input_1.InputAction.UP)) {
                        this.spriteState(1, 'up', Engine2d_1.AnimationType.ANIMATE_REPEAT);
                        dir = TankDirection.UP;
                        this.direction = dir;
                    }
                    else if (Input_1.input.isPressed(Input_1.InputAction.DOWN)) {
                        this.spriteState(1, 'down', Engine2d_1.AnimationType.ANIMATE_REPEAT);
                        dir = TankDirection.DOWN;
                        this.direction = dir;
                    }
                    else if (Input_1.input.isPressed(Input_1.InputAction.LEFT)) {
                        this.spriteState(1, 'left', Engine2d_1.AnimationType.ANIMATE_REPEAT);
                        dir = TankDirection.LEFT;
                        this.direction = dir;
                    }
                    else if (Input_1.input.isPressed(Input_1.InputAction.RIGHT)) {
                        this.spriteState(1, 'right', Engine2d_1.AnimationType.ANIMATE_REPEAT);
                        dir = TankDirection.RIGHT;
                        this.direction = dir;
                    }
                    else {
                        this.spriteAnimation(1, Engine2d_1.AnimationType.STATIC);
                        dir = TankDirection.STAY;
                    }
                    if (dir === TankDirection.UP)
                        this.rect.y -= this.speed;
                    if (dir === TankDirection.DOWN)
                        this.rect.y += this.speed;
                    if (dir === TankDirection.LEFT)
                        this.rect.x -= this.speed;
                    if (dir === TankDirection.RIGHT)
                        this.rect.x += this.speed;
                    if ((oldDirection === TankDirection.UP || oldDirection === TankDirection.DOWN)
                        && (this.direction === TankDirection.LEFT || this.direction === TankDirection.RIGHT)) {
                        // to horizontal
                        this.rect.y = Utils_1.default.snapToGrid(this.rect.y, 16);
                        oldPos.y = this.rect.y;
                    }
                    if ((oldDirection === TankDirection.LEFT || oldDirection === TankDirection.RIGHT)
                        && (this.direction === TankDirection.UP || this.direction === TankDirection.DOWN)) {
                        // to vertical
                        this.rect.x = Utils_1.default.snapToGrid(this.rect.x, 16);
                        oldPos.x = this.rect.x;
                    }
                    var collisions = this.findCollidedContainers();
                    if (collisions.length > 0) {
                        this.setPosition(oldPos);
                    }
                };
                ;
                return Tank;
            }(Container_1.default));
            exports_1("default", Tank);
        }
    };
});
