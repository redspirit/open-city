
let BattleCity = function (canvas) {
    let self = this;

    let engine = new Engine2d(30);
    let map = [];
    let mapUrl = '';

    // actors
    let player = null;
    let myBullet = null;

    // INIT
    engine.initScene(canvas, 480, 480);
    engine.setBitmaps('tanks', './assets/bc_0.png');
    engine.setBitmaps('blocks', './assets/bc_3.png');
    engine.setConfig('./assets/sprites.json');

    this.onReady = engine.load;
    this.onUpdate = engine.onUpdate;

    let loadMap = function (mapUrl, callback) {
        if(!mapUrl)
            return console.error('Map URL not defined!');
        map = [];
        let self = this;
        let oReq = new XMLHttpRequest();
        oReq.onload = function(){
            map = this.responseText.split('\n').map(function (item) {
                return item.split('').filter(function (a) {
                    return a !== '\r';
                }).map(function (a) {
                    return +a;
                });
            });
            callback && callback();
        };
        oReq.open("get", mapUrl, true);
        oReq.send();
    };

    let reset = function () {
        player = new self.Tank();
        myBullet = new self.Bullet();

        player.spawn(160, 416);

        // walls
        new engine.Container(0, 0, 480, 32).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(448, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 448, 480, 32).fillColor('gray').setCollisionGroup('wall');


    };

    engine.load(function () {





        loadMap(mapUrl, function () {
            prepareMapObjects()
        });

        reset();
    });

    let prepareMapObjects = function () {

        let cols = -1;
        let rows = -1;

        map.forEach(function (row) {
            rows += 1;
            cols = -1;
            row.forEach(function (index) {
                cols += 1;

                let x = cols * 16 + 32;
                let y = rows * 16 + 32;

                if(index === 1) {
                    new self.BricksBlock(x, y);
                }

                if(index === 2) {
                    new engine
                        .Container(x, y, 16, 16)
                        .addSprite(1, 'iron', 0, 0)
                        .setCollisionGroup('block');
                }

                if(index === 3) {
                    new engine
                        .Container(x, y, 16, 16)
                        .addSprite(1, 'grass', 0, 0)
                        .setZIndex(15);
                }

                if(index === 4) {
                    new engine
                        .Container(x, y, 16, 16)
                        .addSprite(1, 'ice', 0, 0);
                }

                if(index === 5) {
                    new engine
                        .Container(x, y, 16, 16)
                        .addSprite(1, 'water', 0, 0)
                        .spriteState(1, 'idle')
                        .setCollisionGroup('block')
                        .setName('water');
                }

                if(index === 6) {
                    new engine
                        .Container(x, y, 32, 32)
                        .addSprite(1, 'eagle', 0, 0)
                        .spriteState(1, 'live')
                        .setCollisionGroup('block');
                }

            });

        })

    };


    // METHODS *********************************************

    this.setMap = function (url) {
        mapUrl = url;
    };


    // KEYS ********************

    this.Input = function () {

        let statuses = {};
        let actions = {};
        let pressedCallback = function () {};
        let releasedCallback = function () {};

        document.addEventListener('keydown', function (e) {
            let com = actions[e.keyCode];
            if(com) {
                if(!statuses[com]) pressedCallback(com);
                statuses[com] = true;
            }
        }, false);

        document.addEventListener('keyup', function (e) {
            let com = actions[e.keyCode];
            if(com) {
                statuses[com] = false;
                releasedCallback(com);
            }
        }, false);

        this.assign = function (buttonKey, command) {
            actions[buttonKey] = command;
            statuses[command] = false;
        };
        this.isPressed = function (command) {
            return statuses[command];
        };
        this.onPressed = function (callback) {
            pressedCallback = callback;
        };
        this.onReleased = function (callback) {
            releasedCallback = callback;
        }
    };

    let input = new this.Input();
    this.inputAssign = input.assign;


    input.onPressed(function (command) {

        if(command === 'fire') {
            player.fire();
        }

    });
    input.onReleased(function (command) {

    });

    // ACTORS

    this.Tank = function(){

        let x = 0;
        let y = 0;
        let speed = 2.5;
        let direction = 0;

        let container = new engine
            .Container(x, y, 32, 32)
            .addSprite(1, 'tank_1', 0, 0)
            .spriteState(1, 'top', engine.AnimationType.STATIC)
            .setCollisionGroup('player1')
            .setZIndex(10)
            .setVisible(false);

        let getGrid = function () {
            return {
                xMin: Math.floor(x / 16) * 16,
                xMax: Math.floor(x / 16) * 16 + 16,
                yMin: Math.floor(y / 16) * 16,
                yMax: Math.floor(y / 16) * 16 + 16
            }
        };

        this.spawn = function (sx, sy) {
            x = sx;
            y = sy;
            container.setVisible(true);
        };

        this.getCenter = function () {
            return {
                x: container.x + container.width / 2,
                y: container.y + container.height / 2
            }
        };

        this.fire = function () {

            let offsetX = 0;
            let offsetY = 0;

            // позиционируем пулю относительно танка
            if(direction === 1) { offsetX = 12; offsetY = 0; }
            if(direction === 2) { offsetX = 12; offsetY = 24; }
            if(direction === 3) { offsetX = 0;  offsetY = 12; }
            if(direction === 4) { offsetX = 24; offsetY = 12; }

            myBullet.start(x + offsetX, y + offsetY, direction);

        };
        this.update = function () {

            let oldX = x;
            let oldY = y;
            let dir;
            let oldDirection = direction;

            if(input.isPressed('up')) {
                container.spriteState(1, 'up', engine.AnimationType.ANIMATE_REPEAT);
                dir = 1;
                direction = 1;
            } else if(input.isPressed('down')) {
                container.spriteState(1, 'down', engine.AnimationType.ANIMATE_REPEAT);
                dir = 2;
                direction = 2;
            } else if(input.isPressed('left')) {
                container.spriteState(1, 'left', engine.AnimationType.ANIMATE_REPEAT);
                dir = 3;
                direction = 3;
            } else if(input.isPressed('right')) {
                container.spriteState(1, 'right', engine.AnimationType.ANIMATE_REPEAT);
                dir = 4;
                direction = 4;
            } else {
                container.spriteAnimation(1, engine.AnimationType.STATIC);
                dir = 0;
            }

            if(dir === 1) y -= speed;
            if(dir === 2) y += speed;
            if(dir === 3) x -= speed;
            if(dir === 4) x += speed;

            if((oldDirection === 1 || oldDirection === 2) && (direction === 3 || direction === 4)) {
                // to horizontal
                let grid = getGrid();
                let d1 = Math.abs(grid.yMin - y);
                let d2 = Math.abs(grid.yMax - y);
                y = d1 < d2 ? grid.yMin : grid.yMax;
                oldY = y;
            }
            if((oldDirection === 3 || oldDirection === 4) && (direction === 1 || direction === 2)) {
                // to vertical
                let grid = getGrid();
                let d1 = Math.abs(grid.xMin - x);
                let d2 = Math.abs(grid.xMax - x);
                x = d1 < d2 ? grid.xMin : grid.xMax;
                oldX = x;
            }

            container.setPosition(x, y);

            let collisions = container.findCollidedContainers();
            if(collisions.length > 0) {
                x = oldX;
                y = oldY;
                container.setPosition(x, y);
            }

        };

    };

    this.Bullet = function(){
        let x = 0;
        let y = 0;
        let speed = 8;
        let direction = 0;
        let flying = false;

        let container = new engine
            .Container(x, y, 8, 8)
            .addSprite(1, 'bullet', 0, 0)
            .addSprite(2, 'explode_1', -12, -12)
            .setCollisionGroup('player1')
            .setZIndex(11)
            .setVisible(false)
            .spriteVisible(2, false)
            .spriteState(2, 'explode', engine.AnimationType.ANIMATE_TO_HIDE);

        this.start = function (_x, _y, _dir) {

            if(flying)
                return false;

            direction = _dir;
            x = _x;
            y = _y;

            if(direction === 1) container.spriteState(1, 'up');
            if(direction === 2) container.spriteState(1, 'down');
            if(direction === 3) container.spriteState(1, 'left');
            if(direction === 4) container.spriteState(1, 'right');

            flying = true;
            container
                .spriteVisible(1, true)
                .spriteVisible(2, false)
                .setPosition(x, y)
                .setVisible(true);
            return this;
        };

        this.setSpeed = function (val) {
            speed = val;
            return this;
        };

        this.getContainer = function () {
            return container;
        };

        this.update = function () {

            if(!flying)
                return false;

            if(direction === 1) y -= speed;
            if(direction === 2) y += speed;
            if(direction === 3) x -= speed;
            if(direction === 4) x += speed;

            container.setPosition(x, y);

            let collisions = container.findCollidedContainers([], ['water']);

            if(collisions.length > 0) {

                flying = false;

                collisions.forEach(function (col) {
                    if(col.collisionGroup === 'bricks') {
                        let center = player.getCenter();
                        let side = col.getSizeByTarget(center.x, center.y);
                        col.getParent().hit(side);
                    }
                });

                container.spriteVisible(1, false);
                container.spriteVisible(2, true);
                container.spriteState(2, 'explode', engine.AnimationType.ANIMATE_TO_HIDE);

            }

        }

    };

    this.BricksBlock = function(sx, sy){

        let self = this;

        let parts = [true, true, true, true];

        let container = new engine.Container(sx, sy, 16, 16, this);
        container.addSprite(1, 'bricks', []);
        container.setCollisionGroup('bricks');

        let setParts = function (parts) {
            let positions = [];
            if(parts[0]) positions.push([0,0,0]);
            if(parts[1]) positions.push([8,0,1]);
            if(parts[2]) positions.push([8,8,0]);
            if(parts[3]) positions.push([0,8,1]);
            container.spritePosition(1, positions);

            let box = new Bbox();
            positions.forEach(function (pos) {
                box.extendBox([pos[0], pos[1], 8, 8]);
            });

            let r = box.result();

            container.changeSize(r[0], r[1], r[1], r[2]);
            console.log(r);
            
        };

        this.hit = function (side) {

            if(side === 1) {
                parts[0] = false;
                parts[1] = false;
            }
            if(side === 2) {
                parts[1] = false;
                parts[2] = false;
            }
            if(side === 3) {
                parts[2] = false;
                parts[3] = false;
            }
            if(side === 4) {
                parts[0] = false;
                parts[3] = false;
            }

            setParts(parts);


        };

        setParts(parts);

    };

    // TICKS ***************************

    let Bbox = function(init) {
        let inited = false;
        let min_x = 0;
        let min_y = 0;
        let max_x = 0;
        let max_y = 0;

        this.extendBox = function (rect) {
            if(!inited) {
                min_x = rect[0];
                min_y = rect[1];
                max_x = rect[0] + rect[2];
                max_y = rect[1] + rect[3];
                inited = true;
                return this;
            }
            min_x = Math.min(rect[0], min_x);
            min_y = Math.min(rect[1], min_y);
            max_x = Math.max(rect[2] + rect[0], max_x);
            max_y = Math.max(rect[3] + rect[1], max_y);
            return this;
        };
        this.result = function () {
            return [min_x, min_y, max_x - min_x, max_y - min_y];
        }
    };

    engine.onUpdate(function () {

        player.update();
        myBullet.update();

    });

};