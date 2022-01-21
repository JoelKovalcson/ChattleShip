const User = require('./User');
const Board = require('./Board');
const Game = require('./Game');
const Message = require('./Message');

Message.hasOne(User, {
    foreignKey: 'from'
});

Message.hasOne(User, {
    foreignKey: 'to'
});

User.hasMany(Message, {
    foreignKey: 'from'
});

User.hasMany(Message, {
    foreignKey: 'to'
});

Board.belongsTo(User, {
    foreignKey: 'owner'
});

User.hasMany(Board, {
	foreignKey: 'owner'
});

Game.hasOne(User, {
    foreignKey: 'player1'
});

Game.hasOne(User, {
    foreignKey: 'player2'
});

User.hasMany(Game, {
    foreignKey:'player1'
});

User.hasMany(Game, {
    foreignKey:'player2'
});

module.exports = {User,Board,Game,Message};