

let Engine2d = function(fps) {

    let self = this;

    let resourcesLoaded = false;
    let scenePrepared = false;

    let bitmaps = [];
    let configUrl = '';
    let config = {};
    let containers = [];
    let scene = {
        width: 0,
        height: 0,
        ctx: null
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
           return bitmap.name == name;
        })[0];
    }

    let findSpriteConfig = function (id) {
        return config.filter(function (item) {
           return item.id == id;
        })[0];
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
        this.isRepeatedState = false;
        this.animationCurrentFrame = 0;
        this.animationSkipFrames = 0;

        this.setVisible = function (visible) {
            this.visible = visible;
            return this;
        }
        this.setState = function (name, isRepeat) {
            this.state = states[name];
            this.isRepeatedState = isRepeat;
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
        let states = {};
        params.states && params.states.forEach(function (state) {
            states[state.name] = state.frames;
        });
    }

    this.Container = function (x, y, width, height) {
        let container = this;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.sprites = {};
        this.overflow = false;    // скрыть ли все спрайты за пределом контейнера (w, h)
        this.collisionGroup = null;


        this.addSprite = function (id, spriteName, position, y) {
            let sprite = new self.Sprite(spriteName);
            sprite.setPosition(position, y);
            this.sprites[id] = sprite;
            return this;
        }

        this.setVisible = function (visible) {
            this.visible = visible;
            return this;
        }

        this.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
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
        }
        this.spriteState = function(id, state, isRepeate){
            if(this.sprites[id])
                this.sprites[id].setState(state, isRepeate);
            return this;
        }

        containers.push(this);

    }


    // RENDER *********************************************************

    let render = function () {


        scene.ctx.clearRect(0, 0, scene.width, scene.height);

        containers.forEach(function (container) {

            let sprites = container.getSprites();

            Object.keys(sprites).forEach(function (spriteId) {

                let sprite = sprites[spriteId];
                if(!sprite.visible)
                    return false;

                if(sprite.rects.length > 1 && sprite.state) {
                    renderAnimatedSprite(sprite, container);
                } else {
                    renderStaticSprite(sprite, container);
                }

            });

        });

    }

    let renderStaticSprite = function (sprite, container) {

        sprite.positions.forEach(function (pos) {
            let rectIndex = pos[2] || 0;
            let rect = sprite.rects[rectIndex];
            scene.ctx.drawImage(
                sprite.img,
                rect[0],     // source x
                rect[1],     // source y
                rect[2],     // sprite w
                rect[3],     // sprite h
                pos[0] + container.x,
                pos[1] + container.y,
                rect[2] * sprite.scale,
                rect[3] * sprite.scale
            );
        });

    }

    let renderAnimatedSprite = function (sprite, container) {

        let currentFrame = sprite.state[sprite.animationCurrentFrame];
        let skipping = currentFrame[1];

        if(sprite.animationSkipFrames === skipping) {
            sprite.animationSkipFrames = 0;
            sprite.animationCurrentFrame++;
            if(sprite.animationCurrentFrame === sprite.state.length)
                sprite.animationCurrentFrame = 0;
        }

        sprite.animationSkipFrames++;

        let rect = sprite.rects[currentFrame[0]];

        sprite.positions.forEach(function (pos) {

            scene.ctx.drawImage(
                sprite.img,
                rect[0],     // source x
                rect[1],     // source y
                rect[2],     // sprite w
                rect[3],     // sprite h
                pos[0] + container.x,
                pos[1] + container.y,
                rect[2] * sprite.scale,
                rect[3] * sprite.scale
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

    return this;
};
