

// sprite editor https://www.piskelapp.com
let game = new BattleCity(document.getElementById('canvas'));

game.setMap('./maps/01.txt');

// set buttons
game.inputAssign(38, 'up');
game.inputAssign(40, 'down');
game.inputAssign(37, 'left');
game.inputAssign(39, 'right');
game.inputAssign(32, 'fire');       // Space
game.inputAssign(82, 'reset');      // R
game.inputAssign(80, 'pause');      // P


game.onReady(function () {
    console.log('Resources loaded');


});