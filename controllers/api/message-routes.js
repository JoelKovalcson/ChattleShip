const router = require('express').Router();

router.get('/', (req, res) => {
	console.log(req.query);
});

router.post('/', (req, res) => {

});

module.exports = router;