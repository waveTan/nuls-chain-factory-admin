const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin');




module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    app: [path.resolve(__dirname, '../src/main.js')],
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',
  },
  devtool: false,
  optimization: {
    splitChunks: {
      // minSize: 30000,
      cacheGroups: {
        vendors: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/,
          priority: -10,
        },
        common: {
          chunks: "all",
          name: "common",
          minChunks: 2,
          minSize: 30,
          priority: -20
        }
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({

      })
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      algorithm:  'gzip',
      test:  /\.js$|\.css$/,
      threshold: 30000,
    }),
    new ProgressBarPlugin()
  ]
})