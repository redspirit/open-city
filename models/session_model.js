
const mongoose = require('mongoose');
const _ = require('underscore');
const moment = require('moment');


const Schema = mongoose.Schema;
const SessionSchema = new Schema({
    team1: [{
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }],
    team2: [{
        type: Schema.Types.ObjectId,
        ref: 'Player'
    }],
    created: Date,
    started: Date,
    gamemode: Number,
    status: Number,                 // waiting, game, ended
    results: Schema.Types.Mixed,    // результаты матча
}, {
    versionKey: false
});

SessionSchema.statics.createOne = function (gamemode) {
    let session = new this({
        team1: [],
        team2: [],
        gamemode: gamemode,
        created: new Date(),
        status: CONST.SessionStatus.WAITING
    });
    return session.save();
};

SessionSchema.methods.addPlayer = function(player) {


    let f1 = this.team1.filter(function (item) {
        return player._id.toString() === item._id.toString();
    })[0];
    let f2 = this.team2.filter(function (item) {
        return player._id.toString() === item._id.toString();
    })[0];

    if(f1 || f2) {
        return this;
    }

    if(this.team1.length === 0) {

        this.team1.push(player._id);
        this.markModified('team1');
        return this.save();

    } else if(this.team2.length === 0) {

        this.team2.push(player._id);
        this.markModified('team2');
        this.status = CONST.SessionStatus.PREPARING;
        return this.save();

    } else {

        this.status = CONST.SessionStatus.PREPARING;
        return this.save();

    }

};


SessionSchema.statics.resetAll = function() {
    console.log('reset sessions');
};

SessionSchema.statics.prepare = function(player) {

    return this.findOne({status: CONST.SessionStatus.WAITING}).then((session) => {
        if(session)
            return session.addPlayer(player);

        return this.createOne(1).then((session) => {
            return session.addPlayer(player);
        });

    });

};

SessionSchema.statics.removePlayer = function(player) {

    let query = {
        status: {
            $in: [CONST.SessionStatus.WAITING, CONST.SessionStatus.PREPARING, CONST.SessionStatus.GAME]
        },
        $or: [
            {team1: player._id},
            {team2: player._id}
        ]
    };

    return this.find(query).then((sessions) => {
        _.each(sessions, function (session) {
            session.team1 = _.filter(session.team1, function (item) {
                return !item.equals(player._id);
            });
            session.team2 = _.filter(session.team2, function (item) {
                return !item.equals(player._id);
            });
            session.markModified('team1');
            session.markModified('team2');
            session.save();
        });
        return true;
    })

};

SessionSchema.statics.getCurrents = function() {
    return this.find({status: CONST.SessionStatus.GAME}).sort({started: 1});
};

module.exports = SessionSchema;