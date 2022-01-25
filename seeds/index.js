const seedUsers = require('./user-seeds');
const seedMessages = require('./message-seeds');
const seedGames = require('./game-seeds');
const seedBoards = require('./board-seeds');

const sequelize = require('../config/connection');


const seedAll = async () => {
	await sequelize.sync({force: true});
	console.log('-----------------');
	await seedUsers();
	console.log('-----------------');
	await seedMessages();
	console.log('-----------------');
	await seedBoards();
	console.log('-----------------');
	await seedGames();
	console.log('-----------------');
	process.exit(0);
}

seedAll();