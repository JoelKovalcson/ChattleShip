const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User')

class Board extends Model {}

Board.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        owner: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        grid: {
			type: DataTypes.TEXT,
			allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'board'
    }
);

module.exports = Board;