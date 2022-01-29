const { Game } = require('../models');

const games = [
	{
		turn: 1,
		isComplete: false,
		full: true
	}
];

const seedGames = () => Game.bulkCreate(games);

module.exports = seedGames;