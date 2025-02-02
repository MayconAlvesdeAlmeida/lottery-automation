const Lottery = require('../../models/Lottery');

module.exports = async (req, res) => {
    console.log('Buscando concurso ' + req.params.id);
    try {
        const contest = await Lottery.findOne({ contestNumber: req.params.id }).select('-_id').lean();
        console.log(`Concurso encontrado: ${JSON.stringify(contest)}`);

        if (!contest) {
            return res.status(404).send({error: 'Concurso nao encontrado'});
        }
        return res.status(200).send(contest);

    } catch (error) {
        console.log(`Erro ao buscar concurso ${req.params.id}: ${error}`);
        return res.status(400).send({error: 'Erro ao buscar concurso'});
    }
}