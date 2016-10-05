const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ["babel"], exclude: /node_modules/ }
    ]
  }
};
