const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";

var connection;

if(env === "production") { //if runs on heroku
  connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
} else {
  connection = new Sequelize("random_images", "root", "");
}

// var connection = new Sequelize("random_images", "root", "");

var db = {};

db.like = connection.import(__dirname + "/models/like.js");
db.usersIP = connection.import(__dirname + "/models/usersIp.js");
db.Sequelize = Sequelize;
db.connection = connection;

module.exports = db;
