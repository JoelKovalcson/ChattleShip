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

Board.hasOne(Game, {
	foreignKey: 'board1'
});

Game.belongsTo(Board, {
	foreignKey: 'board1'
});

Board.hasOne(Game, {
	foreignKey: 'board2'
});

Game.belongsTo(Board, {
	foreignKey: 'board2'
});

module.exports = {User,Board,Game,Message};