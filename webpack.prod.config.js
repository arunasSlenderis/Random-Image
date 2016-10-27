const path = require("path");
const webpack = require("webpack");

const vendorModules = [
  "jquery"
];
const appEntry = ["./src/index.js"];

module.exports = {
  devtool: "cheap-module-source-map",
  entry: {
    app: appEntry,
    vendor: vendorModules
  },
  output: {
    path: path.resolve("./dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    })
  ],
  module: {
    exprContextCritical: false,
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ },
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
