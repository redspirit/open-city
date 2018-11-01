
const mongoose = require('mongoose');
const _ = require('underscore');
const moment = require('moment');
const deferred = require('deferred');

let Schema = mongoose.Schema;
let PlayerSchema = new Schema({
    name: String,
    password: String,
    is_admin: Boolean,
    status:Number,                  // offline, free, lobby, play
    created: Date,                  // дата регистрации
    games: Number,                  // кол-во проведенных игр
    wins: Number,                   // кол-во побед
    defeats: Number,                // кол-во поражений
}, {
    versionKey: false
});


PlayerSchema.statics.createNew = function (name, pass) {

    let user = new this();
    user.name = name;
    user.password = pass;
    user.is_admin = false;
    user.status = CONST.UserStatus.FREE;
    user.created = new Date();
    user.games = 0;
    user.wins = 0;
    user.defeats = 0;
    return user.save();

};

PlayerSchema.methods.toPublic = function () {
    return _.pick(this, ['_id', 'name', 'is_admin', 'status']);
};

PlayerSchema.statics.getById = function (id) {
    return this.findById(id);
};

PlayerSchema.statics.resetAll = function() {
    console.log('reset users');
};

PlayerSchema.statics.prepare = function(name, pass) {

    return this.findOne({name:name}).then((user) => {
        if(user) {
            if(user.password === pass) {
                return user;
            } else {
                return 'wrong_pass';
            }
        } else {
            return this.createNew(name, pass);
        }
    });

};

module.exports = PlayerSchema;