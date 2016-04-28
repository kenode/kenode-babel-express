'use strict';

import config from './config'
import express from 'express'
import site from './controller/site'
import sign from './controller/sign'

const router = express.Router()

router.get('/', site.Index)
router.get('/sign-in', sign.signInPage)
router.get('/sign-up', sign.signUpPage)
router.get('/sign-forget', sign.signForgetPage)

export default router
