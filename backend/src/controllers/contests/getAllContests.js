const Lottery = require('../../models/Lottery');

module.exports = async (req, res) => {
    console.log('Buscando todos os concursos');
    try {
        const match = {};
        let limit = req.query.quantity ? req.query.quantity : undefined;
        if (req.query.type && req.query.type == 'lotofacil') {
            match.contestType = req.query.type;
            console.log('consultado sorteios da lotofacil...');
        }

        const contests = await Lottery.find(match).sort({contestNumber: -1}).select('-_id').limit(limit).lean();
        console.log('Concursos encontrados: ' + contests.length);
        return res.status(200).send(contests);

    } catch (error) {
        console.log(`Erro ao buscar todos os concursos: ${error}`);
        return res.status(400).send({error: 'Erro ao buscar concursos'});
    }
}