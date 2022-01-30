const { User, Game, Board } = require('../models');
const { Op } = require("sequelize");
const withAuth = require('../util/auth');

const router = require('express').Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/dashboard');
		return;
	}
	res.render('login');
});

router.get('/dashboard', withAuth, (req, res) => {
	User.findOne({
		where: {
			id: req.session.user_id
		},
		include: {
			model: Board,
			include: {
				model: Game,
				where: {
					isComplete: false,
					full: true
				},
				attributes: ['id', 'turn', 'full', 'isComplete'],
				include: {
					model: Board,
					attributes: ['id'],
					include: {
						model: User,
						attributes: ['user_name', 'id'],
						where: {
							[Op.not]: [{
								id: req.session.user_id
							}]
						}
					}
				}
			},
			attributes: ['id']
		},
		attributes: {
            exclude: ['password']
        }
	})
	.then(userGames => {
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
			limit: 5
		})
		.then(async joinGames => {

			let resumeList = [];
			for (let game of userGames.boards) {
				let resumeObj = {
					gameId: game.game.id
				}
				resumeObj.player1 = req.session.user_name;
				resumeObj.player2 = game.game.boards[0].user.user_name;
				if (game.game.turn == req.session.user_id) resumeObj.playerTurn = resumeObj.player1;
				else resumeObj.playerTurn = resumeObj.player2;
				resumeList.push(resumeObj);
			}

			let joinList = [];
			for (let game of joinGames) {
				let joinObj = {
					gameId: game.id,
					enemy: game.boards[0].user.user_name
				}
				joinList.push(joinObj);
			}

			res.render('dashboard', {
				loggedIn: req.session.loggedIn,
				user_name: req.session.user_name,
				resumeList,
				joinList
			});
		})
	})
	
});

router.get('/game/create', withAuth, (req, res) => {
	res.render('create-game', {
		loggedIn: req.session.loggedIn,
		user_name: req.session.user_name
	});
});

router.get('/game/join/:id', withAuth, (req, res) => {
	Game.findOne({
		where: {
			id: req.params.id
		},
		include: {
			model: Board,
			attributes: ['id'],
			include: {
				model: User,
				attributes: ['id', 'user_name']
			}
		}
	})
	.then(gameData => {
		if(!gameData) {
			res.redirect(404, '/dashboard');
			return;
		}
		if(gameData.dataValues.boards.length > 1) {
			res.redirect(403, '/dashboard');
			return;
		}
		res.render('create-game', {
			loggedIn: req.session.loggedIn,
			user_name: req.session.user_name
		})
	})
	.catch(err => {

	});
})

router.get('/game/:id', withAuth, (req, res) => {
	Game.findOne({
		where: {
			id: req.params.id
		},
		include: {
			model: Board,
			attributes: ['id', 'grid', 'owner'],
			include: {
				model: User,
				attributes: ['id', 'user_name']
			}
		}
	})
	.then(gameData => {
		if(!gameData) {
			res.redirect(404, '/dashboard');
			return;
		}
		let me = gameData.boards.find(board => board.user.dataValues.id == req.session.user_id);
		let enemy = gameData.boards.find(board => board.user.dataValues.id != req.session.user_id);
		res.render('game', {
			loggedIn: req.session.loggedIn,
			user_name: req.session.user_name,
			myBoard: me,
			enemyBoard: enemy
		});
	})
	.catch(err => {
		console.log(err);
		res.redirect(500, '/dashboard');
	});
	
});

router.get('/profile', withAuth, (req, res) => {
	User.findOne({
		where: {
			id: req.session.user_id
		},
		include: {
			model: Board,
			include: {
				model: Game,
				where: {
					isComplete: false,
					full: true
				},
				attributes: ['id', 'turn', 'full', 'isComplete'],
				include: {
					model: Board,
					attributes: ['id'],
					include: {
						model: User,
						attributes: ['user_name', 'id'],
						where: {
							[Op.not]: [{
								id: req.session.user_id
							}]
						}
					}
				}
			},
			attributes: ['id']
		},
		attributes: {
            exclude: ['password']
        }
	})
	.then(userData => {
		if(!userData) {
			res.redirect(404, '/dashboard');
			return;
		}

		let resumeList = [];
		for (let game of userData.boards) {
			let resumeObj = {
				gameId: game.game.id
			}
			resumeObj.player1 = req.session.user_name;
			resumeObj.player2 = game.game.boards[0].user.user_name;
			if (game.game.turn == req.session.user_id) resumeObj.playerTurn = resumeObj.player1;
			else resumeObj.playerTurn = resumeObj.player2;
			resumeList.push(resumeObj);
		}

		res.render('profile', {
			loggedIn: req.session.loggedIn,
			user_name: req.session.user_name,
			user_id: req.session.user_id,
			resumeList
		});
	})
	.catch(err => {
		console.log(err);
		res.render(500, '/dashboard');
	})
});



module.exports = router;