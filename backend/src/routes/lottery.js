const router = require('express').Router();

router.get('/home', require('../controllers/home/getHomePage'));

router.get('/', require('../controllers/contests/getAllContests'));

router.get('/:id', require('../controllers/contests/getConstestById'));

router.get('/:id/statistics', require('../controllers/statistics/getStatisticByContestNumber'));
    
router.post('/', require('../controllers/contests/createContest'));

router.patch('/:id', require('../controllers/contests/updateContest'));

router.delete('/:id', async (req, res) => {
    res.status(200).send('Deletando concurso ' + req.params.id);
});


module.exports = router;