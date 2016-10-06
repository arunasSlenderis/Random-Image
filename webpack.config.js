const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "inline-source-map",
  entry: [
    "webpack-hot-middleware/client",
    "./src/index.js"
  ],
  output: {
    path: path.resolve("./dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ["babel"], exclude: /node_modules/ }
    ]
  }
};
