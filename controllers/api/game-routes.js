const router = require('express').Router();
const {Game, Board, User} = require('../../models');
const {Op} = require('sequelize');

// Get all new games without a second player
router.get('/joinGames', (req, res) => {
	Game.findAll({
			where: {
				isComplete: false,
				full: false
			},
			include: {
				model: Board,
				include: {
					model: User,
					where: {
						[Op.not]: [{
							id: req.session.user_id
						}]
					},
					attributes: ['user_name', 'id']
				}
			},
			limit: 10
		})
		.then(gameData => {
			res.json(gameData);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// Get a specific game
router.get('/:id', (req, res) => {
	Game.findAll({
			where: {
				id: req.params.id
			},
			include: [{
				model: Board,
				attributes: ['owner', 'grid']
			}]
		})
		.then(gameData => res.json(gameData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});


router.post('/', (req, res) => {
	Game.create({
			turn: req.session.user_id,
			isComplete: false,
			full: false
		})
		.then(gameData => res.json(gameData))
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	Game.update(req.body, {
			where: {
				id: req.params.id
			}
		})
		.then(gameData => {
			if (!gameData) {
				res.status(404).json({
					message: 'No game found with that id'
				});
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
				res.status(404).json({
					message: 'No game found with that id'
				});
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