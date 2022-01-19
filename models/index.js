const User = require('./User');
const Board = require('./Board');
const Game = require('./Game');
const Message = require('./Message');

Message.hasOne(User, { 
    as: 'from',
    foreignKey: 'from'
});

Message.hasOne(User, {
    as: 'to',
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

Game.hasOne(User, {
    as: 'player1',
    foreignKey: 'player1'
});

Game.hasOne(User, {
    as: 'player2',
    foreignKey: 'player2'
});

User.hasMany(Game, {
    foreignKey:'player1'
});

User.hasMany(Game, {
    foreignKey:'player2'
});

module.exports = {User,Board,Game,Message};