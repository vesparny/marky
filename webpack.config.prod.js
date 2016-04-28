'use strict'

var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var plugins = [
  new ExtractTextPlugin('main.css'),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
      screw_ie8: true
    }
  })
]

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js'
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
      loader: ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.(eot|otf|svg|ttf|woff|woff2)$/,
      loader: 'file?name=[name]-[hash:base64:5].[ext]'
    }]
  },
  plugins: plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]),
  target: 'electron'
}
