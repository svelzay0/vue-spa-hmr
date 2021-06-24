const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const baseConfig = require("./webpack.base.config.js");

baseConfig.mode = "production";
baseConfig.plugins.push(
  ...[
    new UglifyJsPlugin(),
    new ExtractTextPlugin('[name].css')
  ]
);

module.exports = baseConfig;
