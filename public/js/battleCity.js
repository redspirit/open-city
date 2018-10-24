
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
    engine.setBitmaps('blocks', './assets/bc_1.png');
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
        player = new self.Tank(160, 416);
        myBullet = new self.Bullet();

        new engine.Container(0, 0, 480, 32).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(448, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 448, 480, 32).fillColor('gray').setCollisionGroup('wall');

        new engine
            .Container(10 * 16, 16 * 22 , 16, 16)
            .addSprite(1, 'bricks', [
               // [0,0,0], [8,0,1],
                [0,8,1], [8,8,0]
            ])
            .setCollisionGroup('block')
            .changeSize(0, 8, 16, 8);

        new engine
            .Container(13 * 16, 16 * 22 , 16, 16)
            .addSprite(1, 'bricks', [
                [0,0,0], [8,0,1],
               // [0,8,1], [8,8,0]
            ])
            .setCollisionGroup('block')
            .changeSize(0, 0, 16, 8);

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
                    new engine
                        .Container(x, y, 16, 16)
                        .addSprite(1, 'bricks', [
                            [0,0,0], [8,0,1],
                            [0,8,1], [8,8,0]
                        ])
                        .setCollisionGroup('block');
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

    this.Tank = function(startX, startY){

        let x = startX;
        let y = startY;
        let speed = 2;
        let direction = 0;

        let container = new engine
            .Container(x, y, 32, 32)
            .addSprite(1, 'tank_1', 0, 0)
            .spriteState(1, 'top', engine.AnimationType.STATIC)
            .setCollisionGroup('player1')
            .setZIndex(10);

        let getGrid = function () {
            return {
                xMin: Math.floor(x / 16) * 16,
                xMax: Math.floor(x / 16) * 16 + 16,
                yMin: Math.floor(y / 16) * 16,
                yMax: Math.floor(y / 16) * 16 + 16
            }
        }

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
            let turnOldX = x;
            let turnOldY = y;
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
                if(d1 === d2) {

                    // console.log('PIP!', grid.yMin - oldY);
                    // console.log('PIP!', grid.yMax - oldY);
                    console.log('PIP!', y - oldY);
                    y = ((grid.yMin - oldY) > (grid.yMax - oldY)) ? grid.yMin : grid.yMax;
                } else {
                    y = d1 < d2 ? grid.yMin : grid.yMax;
                }
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

                console.log(collisions);

                flying = false;

                container.spriteVisible(1, false);
                container.spriteVisible(2, true)
                container.spriteState(2, 'explode', engine.AnimationType.ANIMATE_TO_HIDE);

            }

        }

    };

    // TICKS ***************************

    engine.onUpdate(function () {

        player.update();
        myBullet.update();

    });

};