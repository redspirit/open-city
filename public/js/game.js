
let scene = null;
let map = null;

function gameReset() {
    scene.clear();
    map.reset();
    OC.ref.playerRespawnCount = 2;
    OC.ref.score = 0;
    OC.ref.isGameOver = false;
}

// Initialize map picker
let mapTags = document.querySelectorAll("ul.maps li");
for (let i = 0; i < mapTags.length; i++) {
    mapTags[i].addEventListener("click", function (e) {
        for (let j = 0; j < mapTags.length; j++) {
            mapTags[j].className = '';
        }
        e.currentTarget.className = 'active';
        map.load(e.currentTarget.querySelector('img'));
        gameReset();
    });
}

document.onkeydown = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            OC.ref.keyStatus.up = true;
            break;
        case 'ArrowDown':
            OC.ref.keyStatus.down = true;
            break;
        case 'ArrowLeft':
            OC.ref.keyStatus.left = true;
            break;
        case 'ArrowRight':
            OC.ref.keyStatus.right = true;
            break;
        case 'z':
            OC.ref.keyStatus.fire = true;
            break;
        case 'p':
            wesa.core.pause();
            break;
        case 'r':
            gameReset();
            break;
        default:
            break;
    }
}

document.onkeyup = function (e) {
    switch (e.key) {
        case 'ArrowUp':
            OC.ref.keyStatus.up = false;
            break;
        case 'ArrowDown':
            OC.ref.keyStatus.down = false;
            break;
        case 'ArrowLeft':
            OC.ref.keyStatus.left = false;
            break;
        case 'ArrowRight':
            OC.ref.keyStatus.right = false;
            break;
        case 'z':
            OC.ref.keyStatus.fire = false;
            break;
        default:
            break;
    }
}

// Initialize WESA
wesa.core.init(document.getElementById('canvas'));

// Adding assets ready for loading
wesa.assets.source.spriteSheetUrlArray = [
    './assets/bc_0.png',
    './assets/bc_1.png'
];
wesa.assets.source.objectJsonUrl = './assets/tank.json';

// Load assets
wesa.assets.load(function () {

    // Create the scene
    scene = new wesa.Scene('Scene');

    // Create the map on the scene
    map = new OC.Map({
        scene: scene,
        tileWidth: 16,
        tileHeight: 16
    });
    map.load(document.querySelector('ul.maps li.active img'));
    map.reset();

    function updateDisplay() {
        document.querySelector('#collision-checks').innerText = wesa.stat.collisionChecks;
        document.querySelector('#collision-detected').innerText = wesa.stat.collisionsDetected;
        document.querySelector('#score').innerText = OC.ref.score;
        document.querySelector('#respawn-count').innerText = OC.ref.playerRespawnCount;
        let gameStats = document.querySelector('#game-stats');
        if (OC.ref.isGameOver) {
            gameStats.className = 'game-stats game-over';
        }
        else {
            gameStats.className = 'game-stats';
        }
    }

    // Run the scene
    let animate = function () {
        requestAnimationFrame(animate);
        if (OC.ref.player) { OC.ref.player.takeControl(OC.ref.keyStatus); }
        scene.update();
        OC.func.processCollision(scene.getCollisions({ collisionMatrix: OC.config.CollisionMatrix }));
        map.trySpawnEnemy();
        scene.render();
        updateDisplay();
    }
    animate();

});