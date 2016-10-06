const express = require("express");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require("./webpack.config");

const app = express();
const PORT = 3000;
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.use(express.static("./dist"));

app.use("/", (req, res) => res.sendFile(path.resolve("client/index.html")));

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
