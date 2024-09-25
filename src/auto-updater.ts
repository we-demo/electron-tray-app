// See: ./legacy_ollama/auto-updater.ts

import { autoUpdater } from 'electron'
import { logger } from './modules/logger'
import { updateTray } from './modules/tray'

// todo
// const updateURL = `https://ollama.com/api/update?os=${process.platform}&arch=${
//   process.arch
// }&version=${app.getVersion()}&id=${id()}`

let updateAvailable = false

// autoUpdater.setFeedURL({ url: updateURL })

autoUpdater.on('error', e => {
  logger.error(`update check failed - ${e.message}`)
  console.error(`update check failed - ${e.message}`)
})

autoUpdater.on('update-downloaded', () => {
  updateAvailable = true
  updateTray()
})

export function getUpdateAvailable() {
  return updateAvailable
}

export async function checkUpdate() {
  // todo
}
