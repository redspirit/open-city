System.register(["../../engine/Container", "../../engine/geometry/Rect", "../../engine/geometry/Point", "../../engine/Engine2d"], function (exports_1, context_1) {
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
    var Container_1, Rect_1, Point_1, Engine2d_1, TankDirection, Bullet;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Container_1_1) {
                Container_1 = Container_1_1;
            },
            function (Rect_1_1) {
                Rect_1 = Rect_1_1;
            },
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
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
            Bullet = /** @class */ (function (_super) {
                __extends(Bullet, _super);
                function Bullet() {
                    var _this = _super.call(this, new Rect_1.Rect(0, 0, 8, 8)) || this;
                    _this.speed = 8;
                    _this.flying = false;
                    _this.addSprite(1, 'bullet', [new Point_1.default(0, 0)])
                        .addSprite(2, 'explode_1', [new Point_1.default(-12, -12)])
                        .setCollisionGroup('player1')
                        .setZIndex(11)
                        .setVisible(false)
                        .spriteVisible(2, false)
                        .spriteState(2, 'explode', Engine2d_1.AnimationType.ANIMATE_TO_HIDE);
                    _this.direction = TankDirection.UP;
                    return _this;
                }
                Bullet.prototype.start = function (pos, dir) {
                    if (this.flying)
                        return this;
                    this.direction = dir;
                    if (this.direction === TankDirection.UP)
                        this.spriteState(1, 'up');
                    if (this.direction === TankDirection.DOWN)
                        this.spriteState(1, 'down');
                    if (this.direction === TankDirection.LEFT)
                        this.spriteState(1, 'left');
                    if (this.direction === TankDirection.RIGHT)
                        this.spriteState(1, 'right');
                    this.flying = true;
                    this.spriteVisible(1, true)
                        .spriteVisible(2, false)
                        .setPosition(pos)
                        .setVisible(true);
                    return this;
                };
                ;
                Bullet.prototype.setSpeed = function (val) {
                    this.speed = val;
                    return this;
                };
                ;
                Bullet.prototype.update = function () {
                    var _this = this;
                    if (!this.flying)
                        return;
                    if (this.direction === TankDirection.UP)
                        this.rect.y -= this.speed;
                    if (this.direction === TankDirection.DOWN)
                        this.rect.y += this.speed;
                    if (this.direction === TankDirection.LEFT)
                        this.rect.x -= this.speed;
                    if (this.direction === TankDirection.RIGHT)
                        this.rect.x += this.speed;
                    var collisions = this.findCollidedContainers([], ['water']);
                    if (collisions.length > 0) {
                        this.flying = false;
                        collisions.forEach(function (col) {
                            if (col.collisionGroup === 'bricks') {
                                col.hit(_this.tank);
                            }
                        });
                        this.spriteVisible(1, false);
                        this.spriteVisible(2, true);
                        this.spriteState(2, 'explode', Engine2d_1.AnimationType.ANIMATE_TO_HIDE);
                    }
                };
                return Bullet;
            }(Container_1.default));
            exports_1("default", Bullet);
        }
    };
});
