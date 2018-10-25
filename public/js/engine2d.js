

let Engine2d = function(fps) {

    let engine = this;

    let resourcesLoaded = false;
    let scenePrepared = false;

    let bitmaps = [];
    let configUrl = '';
    let config = [];
    let containers = [];
    let scene = {
        width: 0,
        height: 0,
        ctx: null
    }

    this.AnimationType = {
        STATIC: 1,              // показывать только первый кадр
        ANIMATE_REPEAT: 2,     // анимировать и циклить все кадры
        ANIMATE_TO_END: 3,      // анимировать все кадры и остановить на последнем
        ANIMATE_TO_HIDE: 4,     // анимировать все кадры и скрыть спрайт
    }

    this.setBitmaps = function(name, url) {
        bitmaps.push({
            name: name,
            url: url
        });
    };

    this.setConfig = function (url) {
        configUrl = url;
    };

    this.initScene = function (canvas, width, height) {

        if (canvas.getContext){
            scene.ctx = canvas.getContext('2d');
            scene.ctx.imageSmoothingEnabled = false;
            scene.width = width;
            scene.height = height;
            scenePrepared = true;
        } else {
            console.error('canvas unsupported');
        }

    }

    this.load = function (callback) {

        let loadTotal = bitmaps.length + 1;
        let loadCount = 0;
        let checkLoad = function(){
            loadCount++;
            if(loadCount === loadTotal) {
                callback && callback();
                resourcesLoaded = true;
            }
        }

        // load config json
        let oReq = new XMLHttpRequest();
        oReq.onload = function(){
            config = JSON.parse(this.responseText);
            checkLoad();
        };
        oReq.open("get", configUrl, true);
        oReq.send();

        // load bitmaps
        bitmaps.forEach(function (bitmap) {
            bitmap.img = new Image();
            bitmap.img.addEventListener("load", function() {
                checkLoad();
            }, false);
            bitmap.img.src = bitmap.url;
        });

    }

    this.onUpdate = function (callback) {
        updateCallback = callback;
    }

    // INNER FUNCTIONS ************************************************

    let findBitmap = function (name) {
        return bitmaps.filter(function (bitmap) {
           return bitmap.name === name;
        })[0];
    }

    let findSpriteConfig = function (id) {
        return config.filter(function (item) {
           return item.id === id;
        })[0];
    }

    let sortContainersByIndex = function () {
        containers = containers.sort(function (a, b) {
            if (a.zIndex > b.zIndex) return 1;
            if (a.zIndex < b.zIndex) return -1;
            return 0;
        });
    }

    // CLASSES ********************************************************

    this.Sprite = function (id) {
        let self = this;
        let params = findSpriteConfig(id);
        if(!params)
            return console.error('Sprite', id, 'not found');
        let bitmap = findBitmap(params.bitmap);
        if(!bitmap)
            return console.error('Bitmap', params.bitmap, 'not found for sprite', params.id);

        this.img = bitmap.img;
        this.id = params.id;
        this.rects = params.rects;
        this.scale = params.scale || 1;
        this.state = null;
        this.visible = true;
        this.positions = [];
        this.animationType = engine.AnimationType.ANIMATE_REPEAT;
        this.animationCurrentFrame = 0;
        this.animationSkipFrames = 0;
        this.noStates = true;

        this.setVisible = function (visible) {
            this.visible = visible;
            return this;
        }
        this.setState = function (name, animationType) {
            if(this.noStates)
                return this;
            this.state = states[name];
            if(animationType)
                this.animationType = animationType;
            if(animationType === engine.AnimationType.ANIMATE_TO_HIDE || animationType === engine.AnimationType.ANIMATE_TO_END) {
                this.animationCurrentFrame = 0;
                this.animationSkipFrames = 0;
            }
            return this;
        };
        this.setPosition = function (points ,y) { // points OR x, y
            if(Array.isArray(points)) {
                this.positions = points;
            } else {
                this.positions = [[points, y]];
            }
            return this;
        }
        this.setScale = function (scale) {
            this.scale = scale;
            return this;
        }
        this.doAnimation = function (animationType) {
            this.animationType = animationType;
            return this;
        }
        let states = {};
        params.states && params.states.forEach(function (state) {
            states[state.name] = state;
            self.noStates = false;
        });
    };

    this.Container = function (x, y, width, height, parent) {
        let container = this;

        this.x = x;
        this.y = y;
        this.name = '';
        this.width = width;
        this.height = height;
        this.visible = true;
        this.parent = parent;
        this.color = '';
        this.sprites = {};
        this.overflow = false;    // скрыть ли все спрайты за пределом контейнера (w, h)
        this.collisionGroup = null;
        this.zIndex = 0;

        this.setName = function (name) {
            this.name = name;
            return this;
        }
        this.getParent = function () {
            return this.parent;
        }
        this.addSprite = function (id, spriteName, position, y) {
            let sprite = new engine.Sprite(spriteName);
            sprite.setPosition(position, y);
            this.sprites[id] = sprite;
            return this;
        }
        this.fillColor = function (color) {
            this.color = color;
            return this;
        }
        this.setVisible = function (visible) {
            this.visible = visible;
            return this;
        }
        this.setZIndex = function (value) {
            this.zIndex = value;
            sortContainersByIndex();
            return this;
        }
        this.setPosition = function (x, y) {
            this.x = Math.round(x);
            this.y = Math.round(y);
            return this;
        }
        this.setWidth = function (width) {
            this.width = width;
            return this;
        };
        this.setHeight = function (height) {
            this.height = height;
            return this;
        }
        this.setOverflow = function (overflow) {
            this.overflow = overflow;
            return this;
        }
        this.setCollisionGroup = function (group) {
            this.collisionGroup = group;
            return this;
        }
        this.getSprites = function(){
            return this.sprites;
        }
        this.removeSprite = function(id){
            delete this.sprites[id];
            return this;
        }
        this.spriteVisible = function(id, visible){
            if(this.sprites[id])
                this.sprites[id].setVisible(visible);
            return this;
        };
        this.spritePosition = function(id, positions, y){
            if(this.sprites[id])
                this.sprites[id].setPosition(positions, y)
            return this;
        }
        this.spriteState = function(id, state, animationType){
            if(this.sprites[id])
                this.sprites[id].setState(state, animationType);
            return this;
        }
        this.spriteAnimation = function(id, animationType){
            if(this.sprites[id])
                this.sprites[id].doAnimation(animationType);
            return this;
        }
        this.hasCollided = function (cont) {
            return this.x < cont.x + cont.width &&
                this.x + this.width > cont.x &&
                this.y < cont.y + cont.height &&
                this.height + this.y > cont.y;
        }
        this.findCollidedContainers = function (exludeGroups, exludeNames) {
            let me = this;
            let finded = [];
            let groups = exludeGroups || [];
            let names = exludeNames || [];
            containers.forEach(function (c) {
                if(!c.collisionGroup) return false;
                if(groups.indexOf(c.collisionGroup) > -1 || names.indexOf(c.name) > -1) return false;
                if(me.collisionGroup !== c.collisionGroup && me.hasCollided(c)) {
                    finded.push(c);
                }
            });
            return finded;
        };
        this.getCollisionDetails = function(cont){

            if(!this.hasCollided(cont)) {
                return {
                    isCollided: false
                }
            }

            let rect1 = [this.x, this.y, this.x + this.width, this.y + this.height];
            let rect2 = [cont.x, cont.y, cont.x + cont.width, cont.y + cont.height];

            let colResult = calcCollidedArea(rect1, rect2);
            let box = colResult.rect;

            let targetCorner = 0;
            let sourceCorner = 0;
            let targetSide = 0;

            let rect = [box[0], box[1], box[2]-box[0], box[3]-box[1]];
            let relativeRect = [rect[0] - this.x, rect[1] - this.y, rect[2], rect[3]];

            if(box[0] === rect2[0] && box[1] === rect2[1]) targetCorner = 1;    // left top
            if(box[2] === rect2[2] && box[1] === rect2[1]) targetCorner = 2;    // right top
            if(box[2] === rect2[2] && box[3] === rect2[3]) targetCorner = 3;    // right bottom
            if(box[0] === rect2[0] && box[3] === rect2[3]) targetCorner = 4;    // left bottom

            if(rect1[0] === box[0] && rect1[1] === box[1]) sourceCorner = 1;
            if(rect1[2] === box[2] && rect1[1] === box[1]) sourceCorner = 2;
            if(rect1[2] === box[2] && rect1[3] === box[3]) sourceCorner = 3;
            if(rect1[0] === box[0] && rect1[3] === box[3]) sourceCorner = 4;

            return {
                isCollided: true,
                collidedBox: box,
                collidedRect: rect,
                relativeRect: relativeRect,
                targetCorner: targetCorner,
                sourceCorner: sourceCorner
            }
        }

        this.changeSize = function (x, y, w, h) {
            // изменить размер контернера указав внутренний бокс

            this.x += x;
            this.y += y;
            this.width = w;
            this.height = h;

            Object.keys(container.sprites).forEach(function (spriteId) {
                let sprite = container.sprites[spriteId];

                sprite.positions = sprite.positions.map(function (rect) {
                    rect[0] = rect[0] - x;
                    rect[1] = rect[1] - y;
                    return rect;
                });

            });

            return this;

        }

        this.getSizeByTarget = function(x, y){

            let cx = this.x + this.width / 2;
            let cy = this.y + this.height / 2;

            let dx = cx - x;
            let dy = cy - y;

            if(Math.abs(dx) > Math.abs(dy)) {
                // left - right
                return dx > 0 ? 4 : 2
            } else {
                // top - bottom
                return dy > 0 ? 1 : 3;
            }

        }

        containers.push(this);
        sortContainersByIndex();

    }


    // RENDER *********************************************************

    let render = function () {

        scene.ctx.clearRect(0, 0, scene.width, scene.height);

        containers.forEach(function (container) {

            if(!container.visible)
                return false;

            if(container.color) {
                scene.ctx.fillStyle = container.color;
                scene.ctx.fillRect(container.x, container.y, container.width, container.height);
            }

            let sprites = container.getSprites();
            Object.keys(sprites).forEach(function (spriteId) {

                let sprite = sprites[spriteId];
                if(!sprite.visible)
                    return false;

                renderSprite(sprite, container);

            });

        });

    }

    let renderSprite = function (sprite, container) {
        // state = {"name": "explode", "frames": [0, 1, 2], "speed": 3}

        let viewPortX = Infinity;
        let viewPortY = Infinity;
        let skiping = sprite.state ? (sprite.state.speed || 0) : 0;
        let rect = [];

        if(!sprite.state) sprite.animationType = engine.AnimationType.STATIC;

        if(sprite.animationType === engine.AnimationType.STATIC) {
            if(sprite.state) {
                rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];
            } else {
                rect = sprite.rects[0];
            }
        }
        if(sprite.animationType === engine.AnimationType.ANIMATE_REPEAT) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.animationCurrentFrame = 0;
            }
            sprite.animationSkipFrames++;

        }
        if(sprite.animationType === engine.AnimationType.ANIMATE_TO_END) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.animationCurrentFrame = sprite.state.frames.length - 1;
            }
            sprite.animationSkipFrames++;

        }
        if(sprite.animationType === engine.AnimationType.ANIMATE_TO_HIDE) {

            rect = sprite.rects[sprite.state.frames[sprite.animationCurrentFrame]];

            if(sprite.animationSkipFrames === skiping) {
                sprite.animationSkipFrames = 0;
                sprite.animationCurrentFrame++;
                if(sprite.animationCurrentFrame === sprite.state.frames.length)
                    sprite.visible = false;
            }
            sprite.animationSkipFrames++;

        }

        sprite.positions.forEach(function (pos) {

            if(!sprite.state) {
                let rectIndex = pos[2] || 0;
                rect = sprite.rects[rectIndex];
            }

            if(container.overflow) {
                viewPortX = (container.width - pos[0]) / sprite.scale;
                viewPortY = (container.height - pos[1]) / sprite.scale;
            }

            scene.ctx.drawImage(
                sprite.img,
                rect[0],     // source x
                rect[1],     // source y
                Math.min(rect[2], viewPortX),     // sprite w
                Math.min(rect[3], viewPortY),     // sprite h
                pos[0] + container.x,
                pos[1] + container.y,
                Math.min(rect[2], viewPortX) * sprite.scale,
                Math.min(rect[3], viewPortY) * sprite.scale
            );

        });


    }

    // INIT gengerator ************************************************

    let fpsInterval = 1000 / fps;
    let animThen = Date.now();
    let startTime = animThen;
    let animNow = 0;
    let animElapsed = 0;
    let updateCallback = function () {};

    function animate() {

        requestAnimationFrame(animate);

        animNow = Date.now();
        animElapsed = animNow - animThen;

        if (animElapsed > fpsInterval) {
            animThen = animNow - (animElapsed % fpsInterval);

            if(resourcesLoaded && scenePrepared) {
                updateCallback();
                render();
            }

        }
    }
    animate();

    // UTILS **********************

    let calcCollidedArea = function (r1, r2) {

        let rect1 = [r1[0], r1[1], r1[2], r1[3]];
        let rect2 = [r2[0], r2[1], r2[2], r2[3]];

        let box = [
            Math.max(rect1[0], rect2[0]),
            Math.max(rect1[1], rect2[1]),
            Math.min(rect1[2], rect2[2]),
            Math.min(rect1[3], rect2[3])
        ];

        return {
            rect: [
                box[0], box[1], box[2]-box[0], box[3]-box[1]
            ],
            area: Math.abs(box[2]-box[0]) * Math.abs(box[3]-box[1])
        }
    }

    return this;
};
