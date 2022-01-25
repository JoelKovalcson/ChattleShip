const User = require('./User');
const Board = require('./Board');
const Game = require('./Game');
const Message = require('./Message');

User.hasMany(Message, {
    foreignKey: 'from'
});

User.hasMany(Message, {
    foreignKey: 'to'
});

Message.belongsTo(User, {
    foreignKey: 'from',
	onDelete: 'SET NULL'
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

Game.hasOne(User, {
    foreignKey: 'player1'
});

Game.hasOne(User, {
    foreignKey: 'player2'
});

User.belongsToMany(Game, {
    foreignKey:'player1'
});

User.belongsToMany(Game, {
    foreignKey:'player2'
});

module.exports = {User,Board,Game,Message};