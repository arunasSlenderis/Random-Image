import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import bodyParser from "body-parser";
import chalk from "chalk";

import config from "./webpack.config";
// const config = require("./webpack.config");
import db from "./server/database/db";
import * as routes from "./server/routes";

const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static("./dist"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/*", routes.corsFix);

app.get("/", routes.home);

app.post("/info", routes.info);

db.connection.sync({
  // force: true
})
.then(() => {
  app.listen(PORT, error => {
    if(error) throw new Error(chalk.red("Server fault: ", error));
    console.log(chalk.bgBlue("Server is listening on port:"), PORT);
  });
});
