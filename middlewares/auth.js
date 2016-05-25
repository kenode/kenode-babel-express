'use strict';

import validator from 'validator'
import controlSign from '../controller/sign'
import Promise from 'bluebird'
import userProxy from '../proxy/user'
import _ from 'lodash'
import errcode from '../common/error'

const UserProxy = Promise.promisifyAll(userProxy)

const userRequired = (req, res, next) => {
  // 没有登录
  if (!req.user) {
    if (req.headers.accept === 'application/json') {
      return res.json({ code: 1026, data: null })
    }
    return controlSign.signInPage(req, res)
  }
  let auth = req.user
  // 没有设置用户名
  if (notUsername(auth)) {
    return controlSign.setUsernamePage(req, res)
  }
  next()
}


// 判断用户是否设置了用户名
const notUsername = (auth) => 
  validator.isNull(auth.username) || validator.isEmail(auth.username) ? true : false


export default {
  userRequired,
  notUsername
}
