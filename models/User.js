const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
	async checkPassword(pw) {
		return await bcrypt.compare(pw, this.password);
	}
}

User.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
		hooks: {
			async beforeCreate(newUser) {
				newUser.password = await bcrypt.hash(newUser.password, 10);
				return newUser;
			},
			async beforeUpdate(updatedUser) {
				updatedUser.password = await bcrypt.hash(updatedUser.password, 10);
				return updatedUser;
			}
		},
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;