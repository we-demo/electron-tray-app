import { app, BrowserWindow } from 'electron'
import { getProc, restart } from './server'

let welcomeWindow: BrowserWindow | null = null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string

export function firstRunWindow() {
  // Create the browser window.
  welcomeWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    fullscreenable: false,
    // resizable: false,
    movable: true,
    // show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  require('@electron/remote/main').enable(welcomeWindow.webContents)

  welcomeWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  welcomeWindow.on('ready-to-show', () => {
    if (welcomeWindow) {
      welcomeWindow.show()
    }
  })
  welcomeWindow.on('closed', () => {
    if (process.platform === 'darwin') {
      app.dock.hide()
    }
  })
}

app.on('before-quit', () => {
  const proc = getProc()
  if (proc) {
    proc.off('exit', restart)
    proc.kill('SIGINT') // send SIGINT signal to the server, which also stops any loaded llms
  }
})
