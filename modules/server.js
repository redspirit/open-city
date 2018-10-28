

const express = require('express');
const compression = require('compression');
const cookie = require('cookie');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const events = require('./events');

let config = require('./config');


let start = () => {

    /* http */
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());

    app.use('/api/game', require('../controllers/game'));

    app.use(express.static('public', {
        etag: false,
        index: 'index.html'
    }));


    app.use(function (err, req, res, next) {
        res.status(400).send(err.toString());
    });

    server.listen(config.http.port, function() {
        console.log('Server started! Port:', config.http.port);
    });


    /* socket */
    let Player = mongoose.model('Player');
    let Session = mongoose.model('Session');
    io.on('connection', function(socket){

        // let data = cookie.parse(socket.handshake.headers.cookie);
        // let accessToken = data.hic_access;

        let playerId = socket.handshake.query.id;

        console.log('playerId', playerId);

        socket.join(playerId);

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

    });



    /* при запуске сервера сбрасываем все игры и юзеров */
    Player.resetAll();
    Session.resetAll();

};

module.exports.start = start;