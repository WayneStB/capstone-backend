const { DataTypes } = require("sequelize");

module.exports = (db) => {
    return db.define("image", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: DataTypes.STRING,
        Image: DataTypes.STRING,
        userID: DataTypes.INTEGER,
    });
};
