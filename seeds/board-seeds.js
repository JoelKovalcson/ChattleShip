const { Board } = require('../models');

const boards = [
	{
		owner: 1,
		grid: JSON.stringify({
			carrier: {
				letter: 'A',
				number: '1',
				flipped: false,
				length: 5
			},
			battleship: {
				letter: 'B',
				number: '1',
				flipped: false,
				length: 4
			},
			cruiser: {
				letter: 'C',
				number: '1',
				flipped: false,
				length: 3
			},
			submarine: {
				letter: 'D',
				number: '1',
				flipped: false,
				length: 3
			},
			destroyer: {
				letter: 'E',
				number: '1',
				flipped: false,
				length: 2
			},
			shots: [682,170,42,42,10,0,0,0,0,0]
		}),
		game_id: 1
	},
	{
		owner: 2,
		grid: JSON.stringify({
			carrier: {
				letter: 'A',
				number: '1',
				flipped: false,
				length: 5
			},
			battleship: {
				letter: 'B',
				number: '1',
				flipped: false,
				length: 4
			},
			cruiser: {
				letter: 'C',
				number: '1',
				flipped: false,
				length: 3
			},
			submarine: {
				letter: 'D',
				number: '1',
				flipped: false,
				length: 3
			},
			destroyer: {
				letter: 'E',
				number: '1',
				flipped: false,
				length: 2
			},
			shots: [682,170,42,42,10,0,0,0,0,0]
		}),
		game_id: 1
	}
];

const seedBoards = () => Board.bulkCreate(boards);

module.exports = seedBoards;