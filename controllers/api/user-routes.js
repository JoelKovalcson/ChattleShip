const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Board, Game } = require('../../models');

router.get('/mygames', (req, res) => {
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
			res.status(404).json({message: 'User not found with that id'});
			return;
		}
		res.json(userData);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json(err);
	});
});


router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        },
		// TODO: Add includes later for viewing other profiles
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({message: 'No user found with that id'});
            return;
        }
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        user_name: req.body.user_name,
        password: req.body.password
    })
    .then(userData => {
		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.user_name = userData.user_name;
			req.session.loggedIn = true;
			
			res.json(userData);
		});
	})
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            user_name: req.body.user_name
        }
    })
    .then(userData => {
        if(!userData) {
            res.status(400).json({message: 'No user with this username'});
            return;
        }

        const correctPassword = userData.checkPassword(req.body.password);

        if(!correctPassword) {
            res.status(400).json({message: 'Wrong password'});
            return;
        }
		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.user_name = userData.user_name;
			req.session.loggedIn = true;
			res.json({user: userData, message: 'You are logged in'});
		});
    });
});

router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	}
	else {
		res.status(404).end();
	}
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({message: 'No user found with that id'});
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        if (!userData) {
            res.status(404).json({message: 'No user found with that id'});
            return;
        }
        res.json(userData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;