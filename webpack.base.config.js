const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPligin = require("clean-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name]-build.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPligin("./dist", {
      exclude: ["index.html"]
    })
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.common.js"
    }
  }
};
