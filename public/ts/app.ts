
import BattleCity from "./game/Game"
import {InputAction} from "./game/Input";
import Client from "./net/client";
let client = new Client();

// sprite editor https://www.piskelapp.com

let game = new BattleCity(document.getElementById('canvas'));


// set buttons
game.inputAssign(38, InputAction.UP);
game.inputAssign(40, InputAction.DOWN);
game.inputAssign(37, InputAction.LEFT);
game.inputAssign(39, InputAction.RIGHT);
game.inputAssign(32, InputAction.FIRE);       // Space
game.inputAssign(82, InputAction.RESET);      // R
game.inputAssign(80, InputAction.PAUSE);      // P

game.onReady(function () {
    console.log('Resources loaded');
    game.loadMap('./maps/test.txt');
});

