import { app, Menu } from 'electron'
import configureMenu from './configureMenu'
import createWindow from './createWindow'
import window from './windowManager'

let isReady = false
let pathToOpen

function onReady () {
  createWindow(pathToOpen, () => {
    isReady = true
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(configureMenu({app})))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', onReady)

app.on('open-file', (e, path) => {
  e.preventDefault()
  if (isReady) {
    createWindow(path)
  } else {
    pathToOpen = path
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (Object.keys(window.windows).length === 0) {
    createWindow()
  }
})
