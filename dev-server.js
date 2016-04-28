const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.development')

const serverOptions = {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  hot: true,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  },
  historyApiFallback: true
}

const compiler = webpack(config)
const webpackDevServer = new WebpackDevServer(compiler, serverOptions)

webpackDevServer.listen(config._hotPort, function listen (err) {
  if (err) {
    throw err
  }
  console.log('webpack dev server listening on %s', config._hotPort)
})
