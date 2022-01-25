const { Message } = require('../models');

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

const seedMessages = () => Message.bulkCreate(messages);

module.exports = seedMessages;