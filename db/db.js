const Sequelize = require("sequelize");

const db = new Sequelize("postgres://wayneboyd@localhost:5432/storage", {
    logging: false,
});

const Image = require("./Image")(db);
const User = require("./User")(db);

const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("connected");
        db.sync();
    } catch (error) {
        console.error(error);
        console.error("its a no go db Crashed");
    }
    Image.belongsTo(User, { foreignKey: "userID" });
};

connectToDB();

module.exports = { db, Image, User };
