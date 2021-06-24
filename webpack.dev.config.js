const webpack = require("webpack");
const WebpackDevServerOutput = require("webpack-dev-server-output");
const baseConfig = require("./webpack.base.config");

baseConfig.mode = "development";
baseConfig.output.publicPath = "/assets/";
baseConfig.devtool = "source-map";
baseConfig.devServer = {
  contentBase: "./dist",
  host: "127.0.0.1",
  port: 8066,
  hot: true,
  open: true,
  publicPath: "/assets/"
};
baseConfig.plugins.push(
  ...[
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackDevServerOutput({
      path: "./dist/assets",
      isDel: true
    })
  ]
);

module.exports = baseConfig;
