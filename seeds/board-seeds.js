const { Board } = require('../models');

const boards = [
	{
		game_id: 1,
		owner: 1,
		grid: 'SAMPLE BOARD'
	},
	{
		game_id: 1,
		owner: 2,
		grid: 'SAMPLE BOARD'
	}
];

const seedBoards = () => Board.bulkCreate(boards);

module.exports = seedBoards;