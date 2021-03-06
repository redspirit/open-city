System.register([], function (exports_1, context_1) {
    "use strict";
    var Client;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Client = (function () {
                function Client() {
                }
                Client.prototype.connect = function (id) {
                    this.socket = io.connect('', { query: "id=" + id });
                    this.socket.on('connect', function () {
                        console.log('Socket connected');
                    });
                    this.socket.on('disconnect', function () {
                        console.log('Socket DISconnected');
                    });
                };
                return Client;
            }());
            exports_1("default", Client);
        }
    };
});
