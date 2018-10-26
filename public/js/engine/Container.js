System.register(["./Sprite", "./Engine2d", "./Containers"], function (exports_1, context_1) {
    "use strict";
    var Sprite_1, Engine2d_1, Containers_1, Container;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            },
            function (Engine2d_1_1) {
                Engine2d_1 = Engine2d_1_1;
            },
            function (Containers_1_1) {
                Containers_1 = Containers_1_1;
            }
        ],
        execute: function () {
            Container = /** @class */ (function () {
                function Container(rect, insertToList) {
                    if (insertToList === void 0) { insertToList = true; }
                    this.name = '';
                    this.visible = true;
                    this.index = 0;
                    this.color = '';
                    this.sprites = {};
                    this.overflow = false; // скрыть ли все спрайты за пределом контейнера (w, h)
                    this.collisionGroup = '';
                    this.zIndex = 0;
                    this.rect = rect;
                    if (insertToList) {
                        Containers_1.containers.add(this);
                        Containers_1.containers.sortByIndex();
                    }
                }
                Container.prototype.destroy = function () {
                };
                Container.prototype.setName = function (name) {
                    this.name = name;
                    return this;
                };
                // this.getParent = function () {
                //     return this.parent;
                // }
                Container.prototype.addSprite = function (id, spriteName, positions) {
                    var sprite = new Sprite_1.default(spriteName);
                    sprite.setPositions(positions);
                    this.sprites[id] = sprite;
                    return this;
                };
                Container.prototype.fillColor = function (color) {
                    this.color = color;
                    return this;
                };
                Container.prototype.setVisible = function (visible) {
                    this.visible = visible;
                    return this;
                };
                Container.prototype.setZIndex = function (value) {
                    this.zIndex = value;
                    Containers_1.containers.sortByIndex();
                    return this;
                };
                Container.prototype.setPosition = function (point) {
                    this.rect.x = Math.round(point.x);
                    this.rect.y = Math.round(point.y);
                    return this;
                };
                Container.prototype.setRect = function (rect) {
                    this.rect = rect;
                    return this;
                };
                ;
                Container.prototype.setOverflow = function (overflow) {
                    this.overflow = overflow;
                    return this;
                };
                Container.prototype.setCollisionGroup = function (group) {
                    this.collisionGroup = group;
                    return this;
                };
                Container.prototype.getSprites = function () {
                    return this.sprites;
                };
                Container.prototype.removeSprite = function (id) {
                    delete this.sprites[id];
                    return this;
                };
                Container.prototype.spriteVisible = function (id, visible) {
                    if (this.sprites[id])
                        this.sprites[id].setVisible(visible);
                    return this;
                };
                ;
                Container.prototype.spritePositions = function (id, positions) {
                    if (this.sprites[id])
                        this.sprites[id].setPositions(positions);
                    return this;
                };
                Container.prototype.spriteState = function (id, state, animationType) {
                    if (animationType === void 0) { animationType = Engine2d_1.AnimationType.ANIMATE_REPEAT; }
                    if (this.sprites[id])
                        this.sprites[id].setState(state, animationType);
                    return this;
                };
                Container.prototype.spriteAnimation = function (id, animationType) {
                    if (this.sprites[id])
                        this.sprites[id].doAnimation(animationType);
                    return this;
                };
                Container.prototype.findCollidedContainers = function (excludedGroups, excludedNames) {
                    var _this = this;
                    if (excludedGroups === void 0) { excludedGroups = []; }
                    if (excludedNames === void 0) { excludedNames = []; }
                    var groups = excludedGroups || [];
                    var names = excludedNames || [];
                    return Containers_1.containers.getAll().filter(function (c) {
                        if (!c.collisionGroup || !c.visible)
                            return false;
                        if (groups.indexOf(c.collisionGroup) > -1 || names.indexOf(c.name) > -1)
                            return false;
                        return _this.collisionGroup !== c.collisionGroup && _this.rect.isCollided(c.rect);
                    });
                };
                ;
                Container.prototype.changeSize = function (innerRect) {
                    // изменить размер контернера указав внутренний бокс
                    var _this = this;
                    this.rect.x += innerRect.x;
                    this.rect.y += innerRect.y;
                    this.rect.w = innerRect.w;
                    this.rect.h = innerRect.h;
                    Object.keys(this.sprites).forEach(function (spriteId) {
                        var sprite = _this.sprites[spriteId];
                        sprite.positions = sprite.positions.map(function (point) {
                            point.x -= innerRect.x;
                            point.y -= innerRect.y;
                            return point;
                        });
                    });
                    return this;
                };
                return Container;
            }());
            exports_1("default", Container);
        }
    };
});
