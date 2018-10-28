System.register(["./game/Game", "./game/Input", "./net/client"], function (exports_1, context_1) {
    "use strict";
    var Game_1, Input_1, client_1, client, game;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Game_1_1) {
                Game_1 = Game_1_1;
            },
            function (Input_1_1) {
                Input_1 = Input_1_1;
            },
            function (client_1_1) {
                client_1 = client_1_1;
            }
        ],
        execute: function () {
            client = new client_1.default();
            game = new Game_1.default(document.getElementById('canvas'));
            game.inputAssign(38, Input_1.InputAction.UP);
            game.inputAssign(40, Input_1.InputAction.DOWN);
            game.inputAssign(37, Input_1.InputAction.LEFT);
            game.inputAssign(39, Input_1.InputAction.RIGHT);
            game.inputAssign(32, Input_1.InputAction.FIRE);
            game.inputAssign(82, Input_1.InputAction.RESET);
            game.inputAssign(80, Input_1.InputAction.PAUSE);
            game.onReady(function () {
                console.log('Resources loaded');
                game.loadMap('./maps/test.txt');
            });
        }
    };
});
