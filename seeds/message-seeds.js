const { Message } = require('../models');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const messages = [
	{
		message: 'Hello test2',
		from: 1,
		to: 2
	},
	{
		message: 'Hello test1',
		from: 2,
		to: 1
	},
	{
		message: 'How are you?',
		from: 1,
		to: 2
	}
];

const seedMessages = async () => {
	for(var message of messages) {
		Message.create(message);
		await sleep(1000);
	}
}

module.exports = seedMessages;