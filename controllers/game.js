const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

    Player.getById(playerId).then(function (player) {
        if(!player)
            return res.send({error: 'wrong_player'});

        Session.prepare(player).then();
    });




});


module.exports = router;