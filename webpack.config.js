const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "./app/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: path.resolve(__dirname, "assets"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "app"),
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      }
    ]
  },
  devServer: {
    publicPath: "/dist/"
  }
};