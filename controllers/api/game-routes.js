const router = require('express').Router();

router.get('/', (req, res) => {
	console.log(req.query);
});

router.post('/', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;