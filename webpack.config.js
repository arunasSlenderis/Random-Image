const path = require("path");
const webpack = require("webpack");
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
    // new ExtractTextPlugin("styles.css")
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/,
        loader: "url-loader?limit=50"
      }
    ]
  }
};
