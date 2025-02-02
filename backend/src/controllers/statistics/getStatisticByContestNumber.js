const Statistics = require('../../models/Statistics');
const Lottery = require('../../models/Lottery');
const createStatistics = require('../../helpers/statistics/create');

module.exports = async (req, res) => {
    console.log('Buscando estatisticas do concurso ' + req.params.id);

    try {
        const statistics = await Statistics.findOne({ contestNumber: req.params.id }).lean();   
        if (!statistics) {
            console.log('Como nao ha estatisticas para esse concurso, vou criar uma nova');

            const contest = await Lottery.findOne({ contestNumber: req.params.id }).lean();
            if (!contest) {
                console.log('Concurso nao encontrado');
                return res.status(404).send('Concurso não encontrado');
            }

            if (contest.drawnNumbers.length == 0) {
                console.log('Concurso ainda nao foi sorteado');
                return res.status(404).send('Concurso ainda não foi sorteado');
            }

            let newStatistics = createStatistics(contest);
            await Statistics.create(newStatistics);
            console.log('Nova estatisticas criada');
            return res.status(200).send(newStatistics);
        }

        statistics.players.sort((a, b) => b.score - a.score);
        return res.status(200).send(statistics);

    } catch (error) {
        console.log(`Erro ao buscar estatisticas do concurso ${req.params.id}: ${error}`);
        return res.status(400).send('Erro ao buscar estatisticas do concurso');
    }
}