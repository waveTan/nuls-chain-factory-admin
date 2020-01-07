const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Happypack = require('happypack');
const os = require('os');
const happyThreadPool = Happypack.ThreadPool({size:os.cpus().length});
const dev = process.env.NODE_ENV === 'development';
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname,'../dist'),
    publicPath:'/'
  },
  resolve: {
    extensions: ['.jsx', '.js', '.less', '.css', 'json'],
    alias: {
      "src": path.resolve(__dirname,'../src'),
      "page": path.resolve(__dirname,'../src/pages'),
      "utils": path.resolve(__dirname,'../src/utils'),
      "components": path.resolve(__dirname,'../src/components')
    },
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "happypack/loader?id=js"
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader:MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
              reloadAll: true,
            }
          },
          'css-loader', 'postcss-loader', 'less-loader?javascriptEnabled=true'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10240,
            name:'images/[name].[hash:8].[ext]',
          }
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
          },
        ],
      },
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../src/index.html"),
      favicon: path.resolve(__dirname,'../src/images/favicon.ico') //favicon.ico文件路径
    }),
    new Happypack({
      id: 'js',
      loaders: [ 'babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool,
      verbose: true,
    }),
    new MiniCssExtractPlugin({
      filename: dev ? "[name].css" : "css/[name].[chunkhash:8].css",
      chunkFilename: dev ? "[id].css" : "css/chunk[name]-[chunkhash:8].css",
      ignoreOrder: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NULS_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new AntdDayjsWebpackPlugin()
  ],
  performance: false
};