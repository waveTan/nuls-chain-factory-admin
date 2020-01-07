const path = require("path");
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.base.config.js');

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    app:[
      "react-hot-loader/patch",
      path.resolve(__dirname, '../src/main.js')
    ]
  },
  output: {
    filename:"[name].js",
  },
  devServer: {
    hot: true,
    port: 8883,
    progress: true,
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    open: true,
    proxy: {
      "/api": {
        target: "http://api.rap.nuls.center/app/mock/18",
        pathRewrite: {"^/api" : ""},
        changeOrigin: true,
      },
      "/dev": {
        target: "http://192.168.1.160:18081",
        pathRewrite: {"^/dev" : ""},
        changeOrigin: true,
      },
    }

  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
