const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {    
    sequelize.define('temperament', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        temperament: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{ timestamps: false })
}