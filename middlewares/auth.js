'use strict';

import validator from 'validator'
import controlSign from '../controller/sign'
import controlUser from '../controller/user'
//import Promise from 'bluebird'
//import userProxy from '../proxy/user'
//import _ from 'lodash'
//import errcode from '../common/error'

//const UserProxy = Promise.promisifyAll(userProxy)

// 用户权限
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

// 管理员权限
const adminRequired = (req, res, next) => {
  let auth = req.user
  if (!isAdmin(auth.user_type || 0)) {
    if (req.headers.accept === 'application/json') {
      return res.json({ code: 1030, data: null })
    }
    return controlUser.notAuthority(req, res)
  }
  next()
}


// 判断用户是否设置了用户名
const notUsername = (auth) => 
  validator.isNull(auth.username) || validator.isEmail(auth.username) ? true : false

// 判断是否管理员
const isAdmin = (user_type = 0) =>
  user_type > 900 ? true : false

// 判断系统管理员
const isMaster = (user_type = 0) =>
  user_type === 9999 ? true : false


export default {
  userRequired,
  adminRequired,
  notUsername,
  isAdmin,
  isMaster
}
