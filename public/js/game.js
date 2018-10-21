

let engine = new Engine2d(30); // 30 FPS

let sprites = null;

engine.setBitmaps('tanks', './assets/bc_0.png');
engine.setBitmaps('blocks', './assets/bc_1.png');
engine.setConfig('./assets/sprites.json');

engine.initScene(document.getElementById('canvas'), 480, 480);

let Wall = null;
let Water = null;

engine.load(function () {
    console.log('Resources loaded');

    Wall = new engine.Sprite('wall');

    // Water = new engine.Sprite('water');
    // Water.show().setState('idle');
    //
    // Wall.setPositions([[100, 100+32], [116,100+32], [100,116+32], [116,116+32]]);
    // Water.setPositions([[100, 100], [116,100], [100,116], [116,116]]);


    Wall = new engine.Container('wall_container', 50, 50).setPosition(32, 32);
    Wall.addSprite(1, 'wall', [[0, 0], [0,16], [16,0], [16,16]]);

    Water = new engine.Container('water_container', 50, 50).setPosition(0, 0);
    Water.addSprite(1, 'water', [[0, 0], [0,16], [16,0], [16,16]]).spriteState(1, 'idle');

});


let x = 0;
let y = 0;
let speed = 1;

engine.onUpdate(function () {

    x++;
    y++;
    // Water.setPosition(x,0)

    //console.log('tick');

});