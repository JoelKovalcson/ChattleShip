const User = require('./User');
const Board = require('./Board');
const Game = require('./Game');
const Message = require('./Message');

User.hasMany(Message, {
    foreignKey: 'from'
});

Message.belongsTo(User, {
    foreignKey: 'from',
	onDelete: 'SET NULL'
});

User.hasMany(Message, {
    foreignKey: 'to'
});

Message.belongsTo(User, {
    foreignKey: 'to',
	onDelete: 'SET NULL'
});

User.hasMany(Board, {
	foreignKey: 'owner'
});

Board.belongsTo(User, {
    foreignKey: 'owner'
});

Game.hasMany(Board, {
	foreignKey: 'game_id'
});

Board.belongsTo(Game, {
	foreignKey: 'game_id'
});

module.exports = {User,Board,Game,Message};