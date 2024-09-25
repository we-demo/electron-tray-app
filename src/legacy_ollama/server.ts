import { spawn, ChildProcess } from 'child_process'
import { app } from 'electron'
import path from "path"
import { logger } from '../modules/logger'

let proc: ChildProcess = null

export function getProc() {
  return proc
}

export function restart() {
  setTimeout(server, 1000)
}

export function server() {
  const binary = app.isPackaged
    ? path.join(process.resourcesPath, 'ollama')
    : path.resolve(process.cwd(), '..', 'ollama')

  proc = spawn(binary, ['serve'])

  proc.stdout.on('data', data => {
    logger.info(data.toString().trim())
  })

  proc.stderr.on('data', data => {
    logger.error(data.toString().trim())
  })

  proc.on('exit', restart)
}
