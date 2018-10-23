

// sprite editor https://www.piskelapp.com
let game = new BattleCity(document.getElementById('canvas'));

game.setMap('./maps/01.txt');

// set buttons
game.inputAssign('ArrowUp', 'up');
game.inputAssign('ArrowDown', 'down');
game.inputAssign('ArrowLeft', 'left');
game.inputAssign('ArrowRight', 'right');
game.inputAssign(' ', 'fire');
game.inputAssign('r', 'reset');
game.inputAssign('p', 'pause');


game.onReady(function () {
    console.log('Resources loaded');


});