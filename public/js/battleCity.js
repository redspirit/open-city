
let BattleCity = function (canvas) {
    let self = this;

    let engine = new Engine2d(30);
    let map = [];


    // INIT
    engine.initScene(canvas, 480, 480);
    engine.setBitmaps('tanks', './assets/bc_0.png');
    engine.setBitmaps('blocks', './assets/bc_1.png');
    engine.setConfig('./assets/sprites.json');

    this.onReady = engine.load;
    this.onUpdate = engine.onUpdate;

    let loadMap = function (mapUrl, callback) {
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

    engine.load(function () {


        // new engine
        //     .Container('eagle_container_2', 0, 0)
        //     .setPosition(32, 128)
        //     .addSprite(1, 'eagle', [[0, 0]])
        //     .spriteState(1, 'die');
        //



    });

    let prepareMapObjects = function () {

        let x = 0;
        let y = 0;

        map.forEach(function (row) {
            y += 16;
            x = 0;
            row.forEach(function (index) {
                x += 16;

                if(index === 1) {
                    new engine
                        .Container('brick_' + x + '_' + y, 0, 0)
                        .setPosition(x, y)
                        .addSprite(1, 'bricks', [
                            [0,0,0], [8,0,1],
                            [0,8,1], [8,8,0]
                        ]);
                }

                if(index === 2) {
                    new engine
                        .Container('iron_' + x + '_' + y, 0, 0)
                        .setPosition(x, y)
                        .addSprite(1, 'iron', [[0, 0]]);
                };

                if(index === 3) {
                    new engine
                        .Container('grass_' + x + '_' + y, 0, 0)
                        .setPosition(x, y)
                        .addSprite(1, 'grass', [[0, 0]]);
                };

                if(index === 4) {
                    new engine
                        .Container('ice_' + x + '_' + y, 0, 0)
                        .setPosition(x, y)
                        .addSprite(1, 'ice', [[0, 0]]);
                };

                if(index === 5) {
                    new engine
                        .Container('water_' + x + '_' + y, 32, 32)
                        .setPosition(x, y)
                        .addSprite(1, 'water', [[0, 0]])
                        .spriteState(1, 'idle');
                };

                if(index === 6) {
                    new engine
                        .Container('eagle_container', 0, 0)
                        .setPosition(x, y)
                        .addSprite(1, 'eagle', [[0, 0]])
                        .spriteState(1, 'live');
                };



            });

        })

    }

    this.setMap = function (url) {
        loadMap(url, function () {
            prepareMapObjects()
        });
    }

};