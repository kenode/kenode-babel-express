'use strict';

import config from '../config'
import log4js from 'log4js'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

const [_basename, _dirname] = [
  process.cwd(),
  'logger'
]
const logpath = path.join(_basename, _dirname)

if (!existsSync(logpath)) {
  mkdirSync(logpath)
}

log4js.configure({
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'file',
      filename: path.join(_basename, _dirname, config.logger.filename),
      maxLogSize: config.logger.maxlogsize * 1024,
      backups: 3,
      category: config.logger.category
    }
  ],
  replaceConsole: true
})

const logger = log4js.getLogger(config.logger.category)
logger.setLevel('INFO')

export default logger
