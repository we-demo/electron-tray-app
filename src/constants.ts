import { app } from 'electron'
import path from 'path'

// export const logFile = path.join(app.getPath('home'), '.ollama', 'logs', 'server.log')
export const logFile = path.join(app.getPath('home'), '.tray-app', 'logs', 'app.log')

export const appName = 'Tray'
