// import dependencies/files
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create User model
class User extends Model {
    // method to check password
    checkPassword(loginPW) {
        return bcrypt.compareSync(loginPW, this.password);
    }
}

// create fields/columns for User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4]
            }
        },
    },
    {
        // password hash
        hooks: {
            // beforeCreate hook
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // beforeUpdate hook
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

module.exports = User;