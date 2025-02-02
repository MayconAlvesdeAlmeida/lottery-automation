

function createStatistics(contest) {
    const players = contest.players;
    const drawnNumbers = contest.drawnNumbers;
    const statistics = {
        contestNumber: contest.contestNumber,
        players: []
    };

    for (let i = 0; i < players.length; i++) {
        const playerInfo = {
            name: players[i].name,
            score: 0,
            chosenNumbers: players[i].chosenNumbers
        };

        for (let j = 0; j < drawnNumbers.length; j++) {
            if (players[i].chosenNumbers.includes(drawnNumbers[j])) {
                playerInfo.score++;
            }
        }

        statistics.players.push(playerInfo);
    }

    statistics.players.sort((a, b) => b.score - a.score);

    return statistics;
}

module.exports = createStatistics;