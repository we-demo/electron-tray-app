import { app, autoUpdater, Tray, Menu, MenuItemConstructorOptions, nativeTheme } from 'electron'
import * as path from 'path'
import { appName } from '../constants'
import { getUpdateAvailable } from '../auto-updater'

const assetPath = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..', '..', 'assets')

let tray: Tray | null = null

function trayIconPath() {
  const updateAvailable = getUpdateAvailable()
  return nativeTheme.shouldUseDarkColors
    ? updateAvailable
      ? path.join(assetPath, 'iconDarkUpdateTemplate.png')
      : path.join(assetPath, 'iconDarkTemplate.png')
    : updateAvailable
    ? path.join(assetPath, 'iconUpdateTemplate.png')
    : path.join(assetPath, 'iconTemplate.png')
}

function updateTrayIcon() {
  if (tray) {
    tray.setImage(trayIconPath())
  }
}

export function updateTray() {
  const updateAvailable = getUpdateAvailable()

  const updateItems: MenuItemConstructorOptions[] = [
    { label: 'An update is available', enabled: false },
    {
      label: 'Restart to update',
      click: () => autoUpdater.quitAndInstall(),
    },
    { type: 'separator' },
  ]

  const menu = Menu.buildFromTemplate([
    ...(updateAvailable ? updateItems : []),
    { role: 'quit', label: 'Quit', accelerator: 'Command+Q' },
  ])

  if (!tray) {
    tray = new Tray(trayIconPath())
  }

  tray.setToolTip(updateAvailable ? 'An update is available' : '')
  tray.setTitle(' ' + appName)

  tray.setContextMenu(menu)
  tray.setImage(trayIconPath())

  nativeTheme.off('updated', updateTrayIcon)
  nativeTheme.on('updated', updateTrayIcon)
}
