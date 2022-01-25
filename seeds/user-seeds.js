const { User } = require('../models');

const users = [
	{
		user_name: 'test1',
		password: 'abc123'
	},
	{
		user_name: 'test2',
		password: 'abc123'
	}
];

const seedUsers = () => User.bulkCreate(users, {individualHooks: true});

module.exports = seedUsers;