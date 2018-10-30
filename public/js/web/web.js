System.register([], function (exports_1, context_1) {
    "use strict";
    var Web;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Web = (function () {
                function Web() {
                    this.socket = io.connect('', { query: "id=1234567" });
                    this.socket.on('connect', function () {
                        console.log('Socket connected');
                    });
                }
                return Web;
            }());
            exports_1("default", Web);
        }
    };
});
