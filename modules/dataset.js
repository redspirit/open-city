
const mongoose = require('mongoose');
const def = require('deferred')();
const config = require('./config').mongo;

require('./const');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.host + ':' + config.port + '/' + config.database, {
    user: config.user,
    pass: config.password,
    autoIndex: config.autoIndex,
    useNewUrlParser: true
});

let dataset = mongoose.connection;

dataset.on('error', function(e){
    console.error('Ошибка подключения к базе:', e);
    def.reject(e);
});

dataset.once('open', function callback () {
    console.log('Связь с базой установлена');

    mongoose.model('Player',            require('../models/player_model'));
    mongoose.model('Session',           require('../models/session_model'));

    console.log('Модели загружены');
    def.resolve();
});

module.exports = def.promise;