const router = require('express').Router();
const { Game } = require('../../models');

router.get('/', (req, res) => {
	console.log(req.query);
});

router.post('/', (req, res) => {
	Game.create({
		player1: req.body.player1,
		player2: req.body.player2,
		turn: req.body.turn
	})
	.then(gameData => res.json(gameData))
	.catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});

router.put('/:id', (req, res) => {
	Game.update({
		turn: req.body.turn,
		last_move: req.body.last_move
	},
	{
		where: {
			id: req.params.id
		}
	})
	.then(gameData => {
		if (!gameData) {
			res.status(404).json({message: 'No game found with that id'});
			return;
		}
		res.json(gameData);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});

router.delete('/:id', (req, res) => {
	Game.destroy({
		where: {
			id: req.params.id
		}
	})
	.then(gameData => {
		if (!gameData) {
			res.status(404).json({message: 'No game found with that id'});
			return;
		}
		res.json(gameData);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json(err)
	});
});

module.exports = router;