import Container from "../../engine/Container";
import Point from "../../engine/geometry/Point";
import Rect from "../../engine/geometry/Rect";


export default class Tank extends Container{


    private pos: Point;


    constructor() {

        super(new Rect(0,0,32,32));
        
        this.pos = new Point(0,0);


    }


    // let x = 0;
    // let y = 0;
    // let speed = 2.5;
    // let direction = 0;
    //
    // let container = new engine
    //     .Container(x, y, 32, 32)
    //     .addSprite(1, 'tank_1', 0, 0)
    //     .spriteState(1, 'top', engine.AnimationType.STATIC)
    //     .setCollisionGroup('player1')
    //     .setZIndex(10)
    //     .setVisible(false);
    //
    // let getGrid = function () {
    //     return {
    //         xMin: Math.floor(x / 16) * 16,
    //         xMax: Math.floor(x / 16) * 16 + 16,
    //         yMin: Math.floor(y / 16) * 16,
    //         yMax: Math.floor(y / 16) * 16 + 16
    //     }
    // };
    //
    // this.spawn = function (sx, sy) {
    //     x = sx;
    //     y = sy;
    //     container.setVisible(true);
    // };
    //
    // this.getCenter = function () {
    //     return {
    //         x: container.x + container.width / 2,
    //         y: container.y + container.height / 2
    //     }
    // };
    //
    // this.fire = function () {
    //
    //     let offsetX = 0;
    //     let offsetY = 0;
    //
    //     // позиционируем пулю относительно танка
    //     if(direction === 1) { offsetX = 12; offsetY = 0; }
    //     if(direction === 2) { offsetX = 12; offsetY = 24; }
    //     if(direction === 3) { offsetX = 0;  offsetY = 12; }
    //     if(direction === 4) { offsetX = 24; offsetY = 12; }
    //
    //     myBullet.start(x + offsetX, y + offsetY, direction);
    //
    // };
    // this.update = function () {
    //
    //     let oldX = x;
    //     let oldY = y;
    //     let dir;
    //     let oldDirection = direction;
    //
    //     if(input.isPressed('up')) {
    //         container.spriteState(1, 'up', engine.AnimationType.ANIMATE_REPEAT);
    //         dir = 1;
    //         direction = 1;
    //     } else if(input.isPressed('down')) {
    //         container.spriteState(1, 'down', engine.AnimationType.ANIMATE_REPEAT);
    //         dir = 2;
    //         direction = 2;
    //     } else if(input.isPressed('left')) {
    //         container.spriteState(1, 'left', engine.AnimationType.ANIMATE_REPEAT);
    //         dir = 3;
    //         direction = 3;
    //     } else if(input.isPressed('right')) {
    //         container.spriteState(1, 'right', engine.AnimationType.ANIMATE_REPEAT);
    //         dir = 4;
    //         direction = 4;
    //     } else {
    //         container.spriteAnimation(1, engine.AnimationType.STATIC);
    //         dir = 0;
    //     }
    //
    //     if(dir === 1) y -= speed;
    //     if(dir === 2) y += speed;
    //     if(dir === 3) x -= speed;
    //     if(dir === 4) x += speed;
    //
    //     if((oldDirection === 1 || oldDirection === 2) && (direction === 3 || direction === 4)) {
    //         // to horizontal
    //         let grid = getGrid();
    //         let d1 = Math.abs(grid.yMin - y);
    //         let d2 = Math.abs(grid.yMax - y);
    //         y = d1 < d2 ? grid.yMin : grid.yMax;
    //         oldY = y;
    //     }
    //     if((oldDirection === 3 || oldDirection === 4) && (direction === 1 || direction === 2)) {
    //         // to vertical
    //         let grid = getGrid();
    //         let d1 = Math.abs(grid.xMin - x);
    //         let d2 = Math.abs(grid.xMax - x);
    //         x = d1 < d2 ? grid.xMin : grid.xMax;
    //         oldX = x;
    //     }
    //
    //     container.setPosition(x, y);
    //
    //     let collisions = container.findCollidedContainers();
    //     if(collisions.length > 0) {
    //         x = oldX;
    //         y = oldY;
    //         container.setPosition(x, y);
    //     }
    //
    // };



}