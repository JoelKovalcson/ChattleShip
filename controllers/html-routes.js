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
	// Get more information to render page
	res.render('dashboard', {
		loggedIn: req.session.loggedIn
	});
})

module.exports = router;