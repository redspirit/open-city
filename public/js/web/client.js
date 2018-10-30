System.register([], function (exports_1, context_1) {
    "use strict";
    var Client;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Client = (function () {
                function Client() {
                    this.socket = io.connect('', { query: "id=1234567" });
                    this.socket.on('connect', function () {
                        console.log('Socket connected');
                    });
                }
                return Client;
            }());
            exports_1("default", Client);
        }
    };
});
