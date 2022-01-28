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
			limit: 10
		})
		.then(joinGames => {
			res.render('dashboard', {
				loggedIn: req.session.loggedIn,
				user_name: req.session.user_name,
				userGames: userGames,
				joinGames: joinGames
			});
		})
	})
	
});

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
		res.render('game', {
			loggedIn: req.session.loggedIn,
			user_name: req.session.user_name,
			game: gameData
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
		console.log(userData);
		res.render('profile', {
			loggedIn: req.session.loggedIn,
			user_name: req.session.user_name,
			user: userData
		});
	})
	.catch(err => {
		console.log(err);
		res.render(500, '/dashboard');
	})
});

router.get('/game/create', withAuth, (req, res) => {
	res.render('create-game', {
		loggedIn: req.session.loggedIn,
		user_name: req.session.user_name
	});
});

module.exports = router;