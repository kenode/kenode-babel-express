'use strict';

import config from './config'
import express from 'express'
import auth from './middlewares/auth'
import controlSite from './controller/site'
import controlSign from './controller/sign'
import controlUser from './controller/user'
import policesSign from './polices/sign'
import policesUser from './polices/user'

const router = express.Router()

router.get('/', controlSite.Index)
router.get(/^\/(post|note)$/, controlSite.Index)
router.get('/post/:id', controlSite.postPage)

router.get('/sign-in', controlSign.signInPage)
router.get('/sign-up', controlSign.signUpPage)
router.get('/sign-forget', controlSign.signForgetPage)
router.get('/sign-out', controlSign.signOut)
router.post('/sign-in', policesSign.signIn, controlSign.signInLocal)
router.post('/sign-up', policesSign.signUp, controlSign.signUp)
router.post('/sign-username', policesSign.signUsername, controlSign.setUsername)
router.get('/active_account', policesSign.activeAccount, controlSign.activeAccount)
router.post('/sign-forget', policesSign.signForget, controlSign.signForget)
router.get('/reset_pass', policesSign.resetPass, controlSign.resetPass)
router.post('/reset_pass', policesSign.updatePass, controlSign.updatePass)

router.get('/setting', auth.userRequired, controlUser.setting)
router.post('/update-pass', auth.userRequired, policesUser.updatePass, controlUser.updatePass)
router.post('/upload', auth.userRequired, controlUser.upload)
router.post('/upload/:type', auth.userRequired, controlUser.upload)
router.get('/user/writer', auth.userRequired, auth.adminRequired, controlUser.writerPage)
router.post('/user/writer', auth.userRequired, auth.adminRequired, policesUser.writer, controlUser.writer)

router.get('/user/draftapi', auth.userRequired, auth.adminRequired, controlUser.getDraftAPI)
router.get('/user/postapi', auth.userRequired, auth.adminRequired, controlUser.getPostAPI)
router.get('/user/recoverapi', auth.userRequired, auth.adminRequired, controlUser.recoverAPI)
router.get('/user/removeapi', auth.userRequired, auth.adminRequired, controlUser.removeAPI)



export default router
