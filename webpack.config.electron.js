var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'index.dev.js')
  ],
  output: {
    path: __dirname,
    filename: './index.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.DefinePlugin({'global.GENTLY': false}) // superagent https://github.com/visionmedia/superagent/issues/672
  ],
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron-main'
}
