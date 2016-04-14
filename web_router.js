'use strict';

import config from './config'
import express from 'express'
import site from './controller/site'

const router = express.Router()

router.get('/', site.Index)

export default router
