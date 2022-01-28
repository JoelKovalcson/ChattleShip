const router = require('express').Router();

router.get('/', (req, res) => {
	if (req.session.loggedIn) {
		res.redirect('/dashboard', {
			loggedIn: req.session.loggedIn
		});
		return;
	}
	res.render('login');
});

router.get('/dashboard', (req, res) => {
	// TODO: Add game and chat information
	res.render('dashboard', {
		loggedIn: req.session.loggedIn
	});
});

router.get('/game', (req, res) => {
	// TODO: Add game and chat information
	res.render('game', {
		loggedIn: req.session.loggedIn
	});
});

router.get('/profile', (req, res) => {
	// TODO: Add profile and chat information
	res.render('profile', {
		loggedIn: req.session.loggedIn
	});
});

router.get('/')

module.exports = router;