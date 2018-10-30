System.register(["./net/client"], function (exports_1, context_1) {
    "use strict";
    var client_1, client, HTTP, Player, player, Web;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (client_1_1) {
                client_1 = client_1_1;
            }
        ],
        execute: function () {
            client = new client_1.default();
            HTTP = (function () {
                function HTTP() {
                }
                HTTP.get = function (url, callback) {
                    var oReq = new XMLHttpRequest();
                    oReq.onload = function () {
                        callback(JSON.parse(oReq.responseText));
                    };
                    oReq.open("get", url, true);
                    oReq.send();
                };
                HTTP.post = function (url, data, callback) {
                    var oReq = new XMLHttpRequest();
                    oReq.onload = function () {
                        callback(JSON.parse(oReq.responseText));
                    };
                    oReq.open("POST", url);
                    oReq.setRequestHeader("Content-Type", "application/json");
                    oReq.send(JSON.stringify(data));
                };
                return HTTP;
            }());
            Player = (function () {
                function Player() {
                    this.name = '';
                    this.pass = '';
                    this.id = '';
                    this.isAuth = false;
                    this.isAdmin = false;
                    this.localRestore();
                }
                Player.prototype.login = function (name, pass, callback) {
                    var _this = this;
                    if (callback === void 0) { callback = null; }
                    if (this.isAuth)
                        return alert('Уже залогинен!');
                    var form = {
                        name: name,
                        pass: pass
                    };
                    HTTP.post('/api/game/login', form, function (data) {
                        if (data.error === 'wrong_pass')
                            return alert('Это имя игрока уже занято');
                        if (data.error)
                            return alert('Error: ' + data.error);
                        _this.isAuth = true;
                        _this.name = name;
                        _this.pass = pass;
                        _this.id = data._id;
                        _this.isAdmin = data.isAdmin;
                        client.connect(_this.id);
                        _this.localSave();
                        callback && callback(data);
                    });
                };
                Player.prototype.localSave = function () {
                    if (!this.isAuth)
                        return;
                    localStorage.setItem('player_name', this.name);
                    localStorage.setItem('player_pass', this.pass);
                };
                Player.prototype.localRestore = function () {
                    var name = localStorage.getItem('player_name');
                    var pass = localStorage.getItem('player_pass');
                    if (!name || !pass)
                        return;
                    this.login(name, pass);
                    console.log('Login from local');
                };
                Player.prototype.join = function () {
                    if (!this.isAuth)
                        return false;
                    HTTP.post('/api/game/join', { player: this.id }, function (session) {
                        if (session.error)
                            return alert('Error: ' + session.error);
                        console.log('Session', session);
                    });
                };
                return Player;
            }());
            player = new Player();
            Web = (function () {
                function Web() {
                    var _this = this;
                    document.querySelector('#login-button').onclick = function () {
                        _this.onClickLoginButton();
                    };
                }
                Web.prototype.getNamePass = function () {
                    var name = document.querySelector('#login-name').value;
                    var pass = document.querySelector('#login-password').value;
                    return {
                        name: name,
                        pass: pass
                    };
                };
                Web.prototype.onClickLoginButton = function () {
                    var form = this.getNamePass();
                    if (!form.name)
                        return alert('Надо указать имя');
                    if (!form.pass)
                        return alert('Надо указать пароль');
                    player.login(form.name, form.pass);
                };
                return Web;
            }());
            exports_1("default", Web);
        }
    };
});
