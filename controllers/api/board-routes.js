const router = require('express').Router();
const { Board } = require('../../models')

router.post('/', (req, res) => {
    Board.create({
        owner: req.body.owner,
        grid: req.body.grid
    })
    .then(boardData => res.json(boardData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    Board.update({
        grid: req.body.grid
    },
    {
        where: {
            id: req.params.id
        }
    })
    .then(boardData => {
        if (!boardData) {
            res.status(404).json({message: 'No board with that id'});
            return;
        }
        res.json(boardData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Board.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(boardData => {
        if (!boardData) {
            res.status(404).json({message: 'No board with that id'});
            return;
        }
        res.json(boardData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;