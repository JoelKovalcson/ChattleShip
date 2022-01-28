const { Game } = require('../models');

const games = [
	{
		turn: 1,
		isComplete: false,
		full: true
	},
	{
		turn: 1,
		isComplete: false,
		full: false
	},
	{
		turn: 2,
		isComplete: false,
		full: false
	},
	{
		turn: 1,
		isComplete: true,
		full: true
	}
];

const seedGames = () => Game.bulkCreate(games);

module.exports = seedGames;