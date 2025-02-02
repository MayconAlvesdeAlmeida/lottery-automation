const Lottery = require('../../models/Lottery');

module.exports = async (req, res) => {
    console.log('Criando novo concurso');
    const newContest = req.body;
    console.log(`newContest: ${JSON.stringify(newContest)}`);

    try {   
        await Lottery.create(newContest);
        console.log('Concurso criado com sucesso');
        return res.status(201).send({msg: 'Concurso criado com sucesso'});

    } catch (error) {
        console.log(`Erro ao criar novo concurso: ${error}`);
        if (error.code == 11000) {
            return res.status(400).send({error: 'Concurso ja cadastrado'});
        }
        return res.status(500).send({error: 'Erro ao criar concurso'});
    }
}