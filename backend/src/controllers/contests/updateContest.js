const Lottery = require('../../models/Lottery');

module.exports = async (req, res) => {
    console.log('Atualizando concurso ' + req.params.id);

    try {
        const updatedContest = await Lottery.findOneAndUpdate(
            { contestNumber: req.params.id },
            req.body,
            { returnOriginal: false }
        );
        console.log(`updatedContest: ${JSON.stringify(updatedContest)}`);
        return res.status(200).send({msg: 'Concurso atualizado com sucesso'});

    } catch (error) {
        console.log(`Erro ao atualizar concurso ${req.params.id}: ${error}`);
        return res.status(400).send('Erro ao atualizar concurso');
    }
}