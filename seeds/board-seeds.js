const { Board } = require('../models');

const boards = [
	{
		owner: 1,
		grid: 'SAMPLE BOARD'
	},
	{
		owner: 2,
		grid: 'SAMPLE BOARD'
	}
];

const seedBoards = () => Board.bulkCreate(boards);

module.exports = seedBoards;