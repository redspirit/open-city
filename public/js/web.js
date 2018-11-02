System.register(["./net/client"], function (exports_1, context_1) {
    "use strict";
    var client_1, client, HTTP, Player, Web, WebComponents, web, player, webComponents;
    var __moduleName = context_1 && context_1.id;
    function test() {
        console.log('Start');
    }
    exports_1("test", test);
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
                    var userData = web.restoreParams();
                    if (userData.name && userData.pass) {
                        this.login(userData.name, userData.pass);
                    }
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
                        web.saveParams(_this.name, _this.pass);
                        web.elementVisible('.login-form', false);
                        callback && callback(data);
                    });
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
            Web = (function () {
                function Web() {
                    var _this = this;
                    document.querySelector('#login-button').onclick = function () {
                        _this.onClickLoginButton();
                    };
                    document.querySelector('.go-game-button').onclick = function () {
                        _this.onClickJoin();
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
                Web.prototype.onClickJoin = function () {
                    player.join();
                };
                Web.prototype.elementVisible = function (elem, visible) {
                    var classes = document.querySelector(elem).classList;
                    if (visible) {
                        classes.remove('hide');
                    }
                    else {
                        classes.add('hide');
                    }
                };
                Web.prototype.saveParams = function (name, pass) {
                    localStorage.setItem('player_name', name);
                    localStorage.setItem('player_pass', pass);
                };
                Web.prototype.restoreParams = function () {
                    return {
                        name: localStorage.getItem('player_name'),
                        pass: localStorage.getItem('player_pass')
                    };
                };
                return Web;
            }());
            WebComponents = (function () {
                function WebComponents() {
                    var _this = this;
                    this.generedElements = [];
                    this.replacedElements = [];
                    var elements = document.querySelectorAll('[data-repeat]');
                    [].forEach.call(elements, function (container) {
                        container.remove();
                        _this.replacedElements.push({
                            el: container,
                            name: 'data-repeat',
                            value: container.getAttribute('data-text')
                        });
                    });
                }
                WebComponents.prototype.setData = function (_data) {
                    this.data = _data;
                    this.refresh();
                };
                WebComponents.prototype.refresh = function () {
                    var _this = this;
                    this.replacedElements.forEach(function (item) {
                        if (item.name == 'data-repeat') {
                            _this.dataRepeat(item);
                        }
                    });
                };
                WebComponents.prototype.insertAfter = function (elem, refElem) {
                    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
                };
                WebComponents.prototype.dataRepeat = function (item) {
                    if (item.value in this.data && this.data[item.value] instanceof Array) {
                        var thisData = this.data[item.value];
                        for (var i = 0; i <= thisData.length; i++) {
                            var itemData = thisData[i];
                            var newContainer = container.cloneNode(true);
                            newContainer.removeAttribute('data-repeat');
                            this.insertAfter(newContainer, container);
                            this.dataRepeatItem(newContainer, itemData);
                            container = newContainer;
                        }
                    }
                };
                WebComponents.prototype.dataRepeatItem = function (container, data) {
                };
                return WebComponents;
            }());
            web = new Web();
            player = new Player();
            webComponents = new WebComponents();
            webComponents.setData({
                team1Collection: [{ name: 'one' }, { name: 'two' }, { name: 'three' }],
                team2Collection: []
            });
        }
    };
});
