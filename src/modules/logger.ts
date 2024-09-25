
import { logFile } from '../constants'
import winston from 'winston'
import 'winston-daily-rotate-file'

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: logFile,
      maxsize: 1024 * 1024 * 20,
      maxFiles: 5,
    }),
  ],
  format: winston.format.printf(info => info.message),
})
