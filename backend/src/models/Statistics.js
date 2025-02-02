const mongoose = require('mongoose');

const playerStatistics = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }, 
    chosenNumbers: {
        type: [Number],
        required: true
    }
}, {_id: false});

const StatisticsSchema = new mongoose.Schema({
    contestNumber: {
        type: Number,
        unique: true,
        required: true
    },
    players: {
        type: [playerStatistics]
    }

}, {collection: 'statistics'});

const Statistics = mongoose.model('Statistics', StatisticsSchema);
module.exports = Statistics;