const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "eval-source-map",
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
    exprContextCritical: false,
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {
          presets: ["react-hmre"]
        }
      },
      { test: /\.js$/, loader: "eslint", exclude: /node_modules/ },
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
