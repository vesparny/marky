const path = require('path')

if (process.env.NODE_ENV === 'development') {
  require('./dev-server')
  require('electron-reload')(path.join(__dirname, '/src/main/**/*'))
}

// require app
require('./src/main/index')
