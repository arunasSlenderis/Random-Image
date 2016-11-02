const path = require("path");
const fs = require("fs");

const nodeModules = fs.readdirSync("./node_modules").filter(d => d !== ".bin"); //ignoring .bin folder
function ignoreNodeModules(context, request, callback) {
  if(request[0] === ".") {
    return callback();  //include module ex: './smth'
  }

  const module = request.split("/")[0];
  if(nodeModules.indexOf(module) !== -1) {  //if in node_modules folder
    return callback(null, "commonjs " + request); //by appendig module with commonjs webpack does not include module in bundle instead it is making normal require
  }

  return callback();
}

const appEntry = ["./server/prodServer.js"];

module.exports = {
  target: "node",
  devtool: "cheap-module-source-map",
  entry: {
    app: appEntry
  },
  output: {
    path: path.resolve("./distServer"),
    filename: "server.js",
    publicPath: "/"
  },
  module: {
    exprContextCritical: false,
    loaders: [
      { test: /\.js$/, loader: "babel", exclude: /node_modules/ }
    ]
  },
  externals: [ignoreNodeModules]
};
