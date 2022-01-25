const { Game } = require('../models');

const games = [
	{
		turn: 1,
		board1: 1,
		board2: 2,
		isComplete: false
	}
];

const seedGames = () => Game.bulkCreate(games);

module.exports = seedGames;