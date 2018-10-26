System.register([], function (exports_1, context_1) {
    "use strict";
    var InputAction, Input, input;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (InputAction) {
                InputAction[InputAction["LEFT"] = 0] = "LEFT";
                InputAction[InputAction["RIGHT"] = 1] = "RIGHT";
                InputAction[InputAction["UP"] = 2] = "UP";
                InputAction[InputAction["DOWN"] = 3] = "DOWN";
                InputAction[InputAction["FIRE"] = 4] = "FIRE";
                InputAction[InputAction["PAUSE"] = 5] = "PAUSE";
                InputAction[InputAction["RESET"] = 6] = "RESET";
            })(InputAction || (InputAction = {}));
            exports_1("InputAction", InputAction);
            Input = /** @class */ (function () {
                function Input() {
                    var _this = this;
                    this.statuses = [];
                    this.actions = {};
                    this.pressedCallback = function () { };
                    this.releasedCallback = function () { };
                    document.addEventListener('keydown', function (e) { return _this.keydownEvent(e); }, false);
                    document.addEventListener('keyup', function (e) { return _this.keyupEvent(e); }, false);
                }
                Input.prototype.keydownEvent = function (e) {
                    var com = this.actions[e.keyCode];
                    if (typeof com !== 'undefined') {
                        if (!this.statuses[com])
                            this.pressedCallback(com);
                        this.statuses[com] = true;
                    }
                };
                Input.prototype.keyupEvent = function (e) {
                    var com = this.actions[e.keyCode];
                    if (typeof com !== 'undefined') {
                        this.statuses[com] = false;
                        this.releasedCallback(com);
                    }
                };
                Input.prototype.assign = function (code, command) {
                    this.actions[code] = command;
                    this.statuses[command] = false;
                };
                ;
                Input.prototype.isPressed = function (command) {
                    return this.statuses[command];
                };
                ;
                Input.prototype.onPressed = function (callback) {
                    this.pressedCallback = callback;
                };
                ;
                Input.prototype.onReleased = function (callback) {
                    this.releasedCallback = callback;
                };
                return Input;
            }());
            exports_1("input", input = new Input());
        }
    };
});
