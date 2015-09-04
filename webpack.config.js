'use strict';

var path = require('path');
var webpack = require('webpack');
var hotPort = 8000;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

var isDev = process.env.NODE_ENV !== 'production';

var plugins = isDev ? [
  new webpack.HotModuleReplacementPlugin()
] : [
  new ExtractTextPlugin('main.css'),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
      screw_ie8: true
    }
  }),
  new StatsPlugin('webpack.stats.json', {
    source: false,
    modules: false
  })
]

module.exports = {
  devtool: isDev ? 'eval' : 'source-map',
  entry: [
    path.join(__dirname, 'src/main.js')
  ].concat(isDev ? [
    'webpack-dev-server/client?http://localhost:' + hotPort,
    'webpack/hot/dev-server'
  ] : []),
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js', // '[name]-[hash].min.js
    publicPath: '/dist/'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.md?$/,
      loader: 'text'
    }, {
      test: /\.css$/,
      loader: isDev ? 'style!css' : ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.styl$/,
      loader: isDev ?
        'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss!stylus' :
        ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss!stylus')
    }]
  },
  postcss: [
    require('autoprefixer-core')
  ],
  plugins: plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(isDev)
    })
  ]),
  _hotPort: hotPort
};
