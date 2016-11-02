import Sequelize from "sequelize";
import path from "path";

const env = process.env.NODE_ENV || "development";
let connection;

if(env === "production") { //if runs on heroku
  connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres"
  });
} else {
  connection = new Sequelize("random_images", "root", "");
}

const db = {};

db.like = connection.import(path.resolve("./server/database/models/like.js"));
db.usersIP = connection.import(path.resolve("./server/database/models/usersIp.js"));
db.Sequelize = Sequelize;
db.connection = connection;

export default db;
