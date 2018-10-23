
let BattleCity = function (canvas) {
    let self = this;

    let engine = new Engine2d(30);
    let map = [];
    let mapUrl = '';

    // actors
    let player = null;

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
        player = new self.Tank();

        new engine.Container(0, 0, 480, 32).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(448, 0, 32, 480).fillColor('gray').setCollisionGroup('wall');
        new engine.Container(0, 448, 480, 32).fillColor('gray').setCollisionGroup('wall');

    };

    engine.load(function () {

        // new engine
        //     .Container('eagle_container_2', 0, 0)
        //     .setPosition(32, 128)
        //     .addSprite(1, 'eagle', [[0, 0]])
        //     .spriteState(1, 'die');
        //

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
                        .addSprite(1, 'grass', 0, 0);
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
                        .setCollisionGroup('block');
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

    // TANKS

    this.Tank = function(){

        let x = 160;
        let y = 416;
        let speed = 2;
        let direction = 0;
        let roundPixels = 8;

        let container = new engine
            .Container(x, y, 32, 32)
            .addSprite(1, 'tank_1', 0, 0)
            .spriteState(1, 'top', false)
            .setCollisionGroup('player1');

        this.fire = function () {
            console.log('FIRE');
        };
        this.update = function () {

            let oldX = x;
            let oldY = y;

            if(input.isPressed('up')) {
                container.spriteState(1, 'up', true);
                direction = 1;
            } else if(input.isPressed('down')) {
                container.spriteState(1, 'down', true);
                direction = 2;
            } else if(input.isPressed('left')) {
                container.spriteState(1, 'left', true);
                direction = 3;
            } else if(input.isPressed('right')) {
                container.spriteState(1, 'right', true);
                direction = 4;
            } else {
                container.spriteAnimation(1, false);
                direction = 0;
            }


            if(direction === 1) y -= speed;
            if(direction === 2) y += speed;
            if(direction === 3) x -= speed;
            if(direction === 4) x += speed;
            container.setPosition(x, y);

            let collisions = container.findCollidedContainers();

            if(collisions.length > 0) {
                if(collisions.length === 1) {
                    let details = container.getCollisionDetails(collisions[0]);

                    x = oldX;
                    y = oldY;

                    if(details.targetCorner === 3) {
                        if(direction === 1 && details.collidedRect[2] < roundPixels) x = details.collidedBox[2];
                        if(direction === 3 && details.collidedRect[3] < roundPixels) y = details.collidedBox[3];
                    }
                    if(details.targetCorner === 4) {
                        if(direction === 1 && details.collidedRect[2] < roundPixels) x = details.collidedBox[0] - container.width;
                        if(direction === 4 && details.collidedRect[3] < roundPixels) y = details.collidedBox[3];
                    }
                    if(details.targetCorner === 2) {
                        if(direction === 2 && details.collidedRect[2] < roundPixels) x = details.collidedBox[2];
                        if(direction === 3 && details.collidedRect[3] < roundPixels) y = details.collidedBox[1] - container.height;
                    }
                    if(details.targetCorner === 1) {
                        if(direction === 2 && details.collidedRect[2] < roundPixels) x = details.collidedBox[0] - container.width;
                        if(direction === 4 && details.collidedRect[3] < roundPixels) y = details.collidedBox[1] - container.height;
                    }

                } else {
                    x = oldX;
                    y = oldY;
                }
                container.setPosition(x, y);
            }

        }


    };


    // TICKS ***************************

    engine.onUpdate(function () {

        player.update();

    });

};