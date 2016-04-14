'use strict';

import mongoose from 'mongoose'
import util from 'util'
import config from '../config'
import logger from '../common/logger'
import userDao from './user'

mongoose.connect(config.mongo_uri, {
  server: { poolSize: 20 }
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.mongo_uri, err.message)
    process.exit(1)
  }
})

export userDao from './user'
