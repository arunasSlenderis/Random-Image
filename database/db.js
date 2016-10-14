const Sequelize = require("sequelize");

var connection = new Sequelize("random_images", "root", "");

var db = {};

db.like = connection.import(__dirname + "/models/like.js");
db.usersIP = connection.import(__dirname + "/models/usersIp.js");
db.Sequelize = Sequelize;
db.connection = connection;

module.exports = db;
