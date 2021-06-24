// 引入node相关模块
const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPligin = require("clean-webpack-plugin");

// 设置路径
module.exports = {
  // 打包开始的地方,即从这里开始分析模块和资源依赖
  entry: path.resolve(__dirname, "./src/main.js"),
  // 输出
  output: {
    // 输出路径
    path: path.resolve(__dirname, "./dist"),
    // 输出文件名
    filename: "[name]-build.js"
  },
  module: {
    rules: [
      {
        // 解析.vue文件
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
    // 每次重新打包时清楚原本的内容
    new CleanWebpackPligin("./dist", {
      exclude: ["index.html"]
    })
  ],
  resolve: {
    // 通过.vue文件进行模板编译时,需要添加此配置
    alias: {
      vue$: "vue/dist/vue.common.js"
    }
  }
};
