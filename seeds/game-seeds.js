const { Game } = require('../models');

const games = [
	{
		turn: 1
	}
];

const seedGames = () => Game.bulkCreate(games);

module.exports = seedGames;