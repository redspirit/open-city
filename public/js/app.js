System.register(["./game/Game"], function (exports_1, context_1) {
    "use strict";
    var Game_1, game;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Game_1_1) {
                Game_1 = Game_1_1;
            }
        ],
        execute: function () {
            // sprite editor https://www.piskelapp.com
            game = new Game_1.default(document.getElementById('canvas'));
            // set buttons
            game.inputAssign(38, 'up');
            game.inputAssign(40, 'down');
            game.inputAssign(37, 'left');
            game.inputAssign(39, 'right');
            game.inputAssign(32, 'fire'); // Space
            game.inputAssign(82, 'reset'); // R
            game.inputAssign(80, 'pause'); // P
            game.onReady(function () {
                console.log('Resources loaded');
                game.loadMap('./maps/test.txt');
            });
        }
    };
});
