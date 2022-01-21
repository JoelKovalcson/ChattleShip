const router = require('express').Router();

const boardRoutes = require('./board-routes');
const gameRoutes = require('./game-routes');
const messageRoutes = require('./message-routes');
const userRoutes = require('./user-routes');

router.use('/board', boardRoutes);
router.use('/game', gameRoutes);
router.use('/message', messageRoutes);
router.use('/user', userRoutes);

module.exports = router;