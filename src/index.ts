import { app, dialog } from 'electron'
import { appName } from './constants'
import { installed } from './install'
import { checkUpdate } from './auto-updater'
// import { getProc, restart, server } from './legacy_ollama/server'
// import { firstRunWindow } from './legacy_ollama/window'
import { logger } from './modules/logger'
import { updateTray } from './modules/tray'
import { store } from './modules/store'

require('@electron/remote/main').initialize()

if (require('electron-squirrel-startup')) {
  app.quit()
}

app.on('ready', () => {
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.exit(0)
    return
  }

  app.on('second-instance', () => {
    if (app.hasSingleInstanceLock()) {
      app.releaseSingleInstanceLock()
    }

    // const proc = getProc()
    // if (proc) {
    //   proc.off('exit', restart)
    //   proc.kill()
    // }

    app.exit(0)
  })

  app.focus({ steal: true })

  init()
})

function init() {
  if (app.isPackaged) {
    checkUpdate()
    setInterval(() => {
      checkUpdate()
    }, 60 * 60 * 1000)
  }

  updateTray()

  if (process.platform === 'darwin') {
    if (app.isPackaged) {
      if (!app.isInApplicationsFolder()) {
        const chosen = dialog.showMessageBoxSync({
          type: 'question',
          buttons: ['Move to Applications', 'Do Not Move'],
          message: `${appName} works best when run from the Applications directory.`,
          defaultId: 0,
          cancelId: 1,
        })

        if (chosen === 0) {
          try {
            app.moveToApplicationsFolder({
              conflictHandler: conflictType => {
                if (conflictType === 'existsAndRunning') {
                  dialog.showMessageBoxSync({
                    type: 'info',
                    message: 'Cannot move to Applications directory',
                    detail:
                      `Another version of ${appName} is currently running from your Applications directory. Close it first and try again.`,
                  })
                }
                return true
              },
            })
            return
          } catch (e) {
            logger.error(`[Move to Applications] Failed to move to applications folder - ${e.message}}`)
          }
        }
      }
    }
  }

  // server()

  if (process.platform === 'darwin') {
    app.dock.hide()
  }
  if (store.get('first-time-run') && installed()) {
    // if (process.platform === 'darwin') {
    //   app.dock.hide()
    // }

    app.setLoginItemSettings({ openAtLogin: app.getLoginItemSettings().openAtLogin })
    return
  }

  // This is the first run or the CLI is no longer installed
  app.setLoginItemSettings({ openAtLogin: true })
  // firstRunWindow()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
