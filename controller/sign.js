'use strict';

import config from '../config'
import views from '../views/views.json'
import Passport from 'passport'
import Promise from 'bluebird'
import userProxy from '../proxy/user'
import auth from '../middlewares/auth'
import Tools from '../common/tools'
import _ from 'lodash'
import errcode from '../common/error'

const UserProxy = Promise.promisifyAll(userProxy)

// 登录页面
const signInPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-in') {
    if (auth.notUsername(req.user)) {
      return setUsernamePage(req, res, next)
    }
    return res.redirect('/')
  }
  res.render('sign-in', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner'],
    entry: views.entry['sign-in'],
    sign: Object.assign(config.sign, { active: 'sign-in' }),
    auth: req.user
  })
}

// 注册页面
const signUpPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-up') {
    if (auth.notUsername(req.user)) {
      return setUsernamePage(req, res, next)
    }
    return res.redirect('/')
  }
  res.render('sign-up', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner'],
    entry: views.entry['sign-up'],
    sign: Object.assign(config.sign, { active: 'sign-up' }),
    auth: req.user
  })
}

// 密码找回页面
const signForgetPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-forget') {
    return res.redirect('/')
  }
  res.render('sign-forget', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner'],
    entry: views.entry['sign-forget'],
    sign: Object.assign(config.sign, { active: 'sign-forget' })
  })
}

// 登出操作
const signOut = (req, res) => {
  req.logout()
  return res.redirect('/')
}

// 登录操作 -> Local
const signInLocal = (data, req, res, next) => {
  /*Passport.authenticate('local', {
    badRequestMessage: '505 error'
  }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.json({ code: 1003, data: null })
    }
    req.logIn(user, err => {
      if (err) { return next(err) }
      return res.json({ code: 0, data: user })
    })
  })(req, res, next)*/
  UserProxy.localStrategyAsync(data)
            .then( user => {
              req.logIn(user, err => {
                if (err) { return next(err) }
                return res.json({ code: 0, data: user })
              })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
            .catch( err =>  next(err) )
}

// 注册操作
const signUp = (data, req, res, next) => {
  UserProxy.signUpEmailAsync(data)
            .then( user => {
              req.logIn(user, err => {
                if (err) { return next(err) }
                return res.json({ code: 0, data: user })
              })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
            .catch( err =>  next(err) )
}

// 设置用户名页面
const setUsernamePage = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/sign-in')
  }
  res.render('sign-username', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner'],
    entry: views.entry['sign-username'],
    sign: Object.assign(config.sign, { active: 'sign-username' })
  })
}

// 设置用户名
const setUsername = (data, req, res, next) => {
  UserProxy.setUsernameAsync(data)
            .then( user => {
              req.logIn(user, err => {
                if (err) { return next(err) }
                return res.json({ code: 0, data: user })
              })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
            .catch( err =>  next(err) )
}

// 激活邮件
const activeAccount = (data, req, res, next) => {
  let assignData = {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner'],
    entry: views.entry['page-base'],
    sign: Object.assign(config.sign, { active: 'sign-info' })
  }
  UserProxy.activeAccountAsync(data)
            .then( user => {
              return res.render('sign-info', Object.assign(assignData, {
                signInfo: {
                  title: '激活邮箱',
                  content: '帐号已被激活，请登录'
                }
              }))
            })
            .catch(Tools.myError, err => {
              let errInfo = _.find(errcode, { code: err.code })
              return res.render('sign-info', Object.assign(assignData, {
                signInfo: {
                  title: '激活邮箱',
                  content: errInfo.message
                }
              }))
            })
            .catch( err =>  next(err) )
}

// 找回密码
const signForget = (data, req, res, next) => {
  UserProxy.signForgetAsync(data)
            .then( user => {
              return res.json({ code: 0, data: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。' })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
            .catch( err => next(err) )
}

// 重设密码页面
const resetPass = (data, req, res, next) => {
  let assignData = {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-inner']
  }
  UserProxy.resetPassAsync(data)
            .then( user => {
              return res.render('reset-pass', Object.assign(assignData, {
                entry: views.entry['reset-pass'],
                sign: Object.assign(config.sign, { active: 'reset-pass' })
              }))
            })
            .catch(Tools.myError, err => {
              let errInfo = _.find(errcode, { code: err.code })
              return res.render('sign-info', Object.assign(assignData, {
                entry: views.entry['page-base'],
                sign: Object.assign(config.sign, { active: 'sign-info' }),
                signInfo: {
                  title: '重置密码',
                  content: errInfo.message
                }
              }))
            })
           .catch( err =>  next(err) )
}

// 更新密码
const updatePass = (data, req, res, next) => {
  UserProxy.updatePassAsync(data)
            .then( user => {
              return res.json({ code: 0, data: '您的密码已重置完成。' })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
           .catch( err =>  next(err) )
}

export default {
  signInPage,
  signUpPage,
  setUsernamePage,
  signForgetPage,
  signOut,
  signInLocal,
  signUp,
  setUsername,
  activeAccount,
  signForget,
  resetPass,
  updatePass
}