const router = require('express').Router();
const { User } = require('../../models');

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
        res.json({user: userData});
        const correctPassword = userData.checkPassword(req.body.password);
        if(!correctPassword) {
            res.status(400).json({message: 'Wrong password'});
            return;
        }
        res.json({user: userData, message: 'You are logged in'});
    });
});

router.post('/logout', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(userData => {
        req.session.destroy(() => {
            req.logout(userData);
            res.redirect('/');
        });
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        }
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
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
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