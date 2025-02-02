const mongoose = require('mongoose');

const PlayersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    chosenNumbers: {
        type: [Number],
        default: []
    }
}, {_id: false});

const LotterySchema = new mongoose.Schema({
    contestNumber: {
        type: Number,
        required: true, 
        unique: true
    },
    contestDate: {
        type: Date,
        required: true
    },
    drawnNumbers: {
        type: [Number]
    },
    players: {
        type: [PlayersSchema],
        default: []
    },
    contestType: {
        type: String
    }

}, {collection: 'contests'});

const Constest = mongoose.model('Contest', LotterySchema);
module.exports = Constest;