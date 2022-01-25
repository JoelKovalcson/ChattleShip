const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User')

class Game extends Model {}

Game.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        turn: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: 'id'
			}
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'game'
    }
);

module.exports = Game;