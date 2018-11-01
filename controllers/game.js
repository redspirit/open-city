const _ = require('underscore');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const events = require('../modules/events');
let Player = mongoose.model('Player');
let Session = mongoose.model('Session');

router.get('/current_sessions', function (req, res){

    Session.getCurrents().then(function (items) {
        res.send(items);
    }, function (err) {
        res.status(400).send({error: err});
    });

});

router.post('/login', function (req, res){

    let name = req.body.name;
    let pass = req.body.pass;

    if(!name)
        return res.send({error: 'name_required'});

    if(!pass)
        return res.send({error: 'pass_required'});

    Player.prepare(name, pass).then(function (user) {
        if(user === 'wrong_pass')
            return res.send({error: 'wrong_pass'});

        res.send(user);

    });

});

router.post('/join', function (req, res){

    let playerId = req.body.player;

    if(!mongoose.Types.ObjectId.isValid(playerId)) {
        return res.send({error: 'invalid_player'});
    }


    Player.getById(playerId).then(function (player) {
        if(!player)
            return res.send({error: 'wrong_player'});

        Session.prepare(player).then(function (session) {

            session.populate(['team1', 'team2'], function (err, popSession) {
                if(err) console.error(err);
                popSession.team1 = _.map(popSession.team1, function (item) {
                    return item.toPublic();
                });
                popSession.team2 = _.map(popSession.team2, function (item) {
                    return item.toPublic();
                });
                res.send(popSession);
            });

        });
    });

});

events.on('disconnect', function (socket) {
    console.log('Player disconnected', socket.player.name);
    Session.removePlayer(socket.player);
});


module.exports = router;