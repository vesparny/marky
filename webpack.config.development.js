'use strict'

var path = require('path')
var webpack = require('webpack')
var hotPort = 8000

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:8000/',
    'webpack/hot/dev-server',
    path.join(__dirname, 'src/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: 'http://localhost:8000/dist/'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(eot|otf|svg|ttf|woff|woff2)$/,
      loader: 'file?name=[name]-[hash:base64:5].[ext]'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  _hotPort: hotPort,
  // https://github.com/webpack/webpack/issues/2069
  target: 'electron-renderer'
}
