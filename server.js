const express = require("express");
const server = express();
const cors = require("cors");
server.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:3000",
            "https://dashboard.heroku.com/apps/waynestb-capstone-frontend",
        ],
    })
);
const bodyParser = require("body-parser");
server.use(bodyParser.json());
const bcrypt = require("bcrypt");

const sessions = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(sessions.Store);
const { db, User, Image } = require("./db/db.js");

const oneMonth = 1000 * 60 * 24 * 30;
server.use(
    sessions({
        secret: "adminkey",
        store: new SequelizeStore({ db }),
        cookie: { maxAge: oneMonth },
    })
);
let port = process.env.PORT;
if (!port) {
    port = 3001;
}

//look at blog backend to add server.post login & any other endpoints

server.get("/", (req, res) => {
    res.send({ hello: "world" });
});

server.post("/login", async (req, res) => {
    const user = await User.findOne(
        { where: { username: req.body.username } },
        { raw: true }
    );
    if (!User) {
        res.send({ error: "username not found" });
    } else {
        const matchingPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (matchingPassword) {
            req.session.user = user;
            res.send({ succes: true, message: "Welcome" });
        } else {
            res.send({ error: "Please enter again" });
        }
    }
});

server.post("/createAccount", async (req, res) => {
    const newUser = await User.findOne({
        where: { username: req.body.username },
    });
    if (newUser) {
        res.send({ error: "username taken. try again" });
    } else {
        User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
        });
        res.send({ success: true });
    }
});

server.get("/loginStatus", (req, res) => {
    if (req.session.user) {
        res.send({ isLoggedIn: true });
    } else {
        res.send({ isLoggedIn: false });
    }
});

server.get("/logout", (req, res) => {
    req.session.destroy();
    res.send({ isLoggedIn: false });
});

const autheRequired = (req, res, next) => {
    if (!req.session.user) {
        res.send({ error: "You're Not Logged In" });
    } else {
        next();
    }
};

server.listen(port, () => {
    console.log("Server running.");
});

const createFirstUser = async () => {
    const users = await User.findAll();
    if (users.length === 0) {
        User.create({
            username: "wayne",
            password: bcrypt.hashSync("wonderful", 10),
        });
    }
};

createFirstUser();
