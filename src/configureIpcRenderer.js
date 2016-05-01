import * as actions from './actions'
import { ipcRenderer } from 'electron'

export default function configureIpcRenderer (store) {
  ipcRenderer.on('MARKY::file-loaded', (e, {file, fileName, filePath}) => {
    store.dispatch(actions.convertMarkdown(file))
    store.dispatch(actions.fileLoaded({fileName, filePath}))
  })

  ipcRenderer.on('MARKY::ask-file-save', (e) => {
    const data = store.getState().markdown.markdown
    const filePath = store.getState().markdown.filePath
    if (!filePath) {
      ipcRenderer.send('MARKY::save-file-as', {
        data
      })
      return
    }
    ipcRenderer.send('MARKY::save-file', {
      data,
      filePath
    })
  })

  ipcRenderer.on('MARKY::ask-file-save-as', (e) => {
    const data = store.getState().markdown.markdown
    ipcRenderer.send('MARKY::save-file-as', {
      data
    })
  })

  window.document.addEventListener('drop', (e) => {
    e.preventDefault()
    ipcRenderer.send('MARKY::dropped-file', {
      filePath: e.dataTransfer.files[0].path
    })
  })

  window.document.addEventListener('dragover', (e) => {
    e.preventDefault()
  })
}
