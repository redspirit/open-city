

// sprite editor https://www.piskelapp.com
let game = new BattleCity(document.getElementById('canvas'));

game.setMap('./maps/main.txt');

// set buttons
game.setAction('ArrowUp', game.inputActions.Up);
game.setAction('ArrowDown', game.inputActions.Down);
game.setAction('ArrowLeft', game.inputActions.Left);
game.setAction('ArrowRight', game.inputActions.Rigth);
game.setAction(' ', game.inputActions.Fire);
game.setAction('r', game.inputActions.Reset);
game.setAction('p', game.inputActions.Pause);

game.onReady(function () {
    console.log('Resources loaded');


});