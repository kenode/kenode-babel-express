'use strict';

import view from '../middlewares/view'
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
  let _assign = view.assign({
                  title: '$1 - 登录',
                  style: 'sign-inner',
                  entry: 'sign-in',
                  sign: 'sign-in'
                }, req.user)
  res.render('sign-in', _assign)
}

// 注册页面
const signUpPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-up') {
    if (auth.notUsername(req.user)) {
      return setUsernamePage(req, res, next)
    }
    return res.redirect('/')
  }
  let _assign = view.assign({
                  title: '$1 - 注册',
                  style: 'sign-inner',
                  entry: 'sign-up',
                  sign: 'sign-up'
                }, req.user)
  res.render('sign-up', _assign)
}

// 密码找回页面
const signForgetPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-forget') {
    return res.redirect('/')
  }
  let _assign = view.assign({
                  title: '$1 - 密码找回',
                  style: 'sign-inner',
                  entry: 'sign-forget',
                  sign: 'sign-forget'
                }, req.user)
  res.render('sign-forget', _assign)
}

// 登出操作
const signOut = (req, res) => {
  req.logout()
  return res.redirect('/')
}

// 登录操作 -> Local
const signInLocal = (data, req, res, next) => {
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
  let _assign = view.assign({
                  title: '$1 - 密码找回',
                  style: 'sign-inner',
                  entry: 'sign-username',
                  sign: 'sign-username'
                }, req.user)
  res.render('sign-username', _assign)
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
  let _assign = view.assign({
                  title: '$1 - 激活邮箱',
                  style: 'sign-inner',
                  entry: 'page-base',
                  sign: 'sign-info'
                }, req.user)
  UserProxy.activeAccountAsync(data)
            .then( user => {
              return res.render('sign-info', Object.assign(_assign, {
                signInfo: {
                  title: '激活邮箱',
                  content: '帐号已被激活，请登录'
                }
              }))
            })
            .catch(Tools.myError, err => {
              let errInfo = _.find(errcode, { code: err.code })
              return res.render('sign-info', Object.assign(_assign, {
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
  let _assign
  UserProxy.resetPassAsync(data)
            .then( user => {
              _assign = view.assign({
                  title: '$1 - 重设密码',
                  style: 'sign-inner',
                  entry: 'reset-pass',
                  sign: 'reset-pass'
                }, req.user)
              return res.render('reset-pass', _assign)
            })
            .catch(Tools.myError, err => {
              let errInfo = _.find(errcode, { code: err.code })
              _assign = view.assign({
                  title: '$1 - 重设密码',
                  style: 'sign-inner',
                  entry: 'page-base',
                  sign: 'sign-info',
                  signInfo: {
                    title: '重置密码',
                    content: errInfo.message
                  }
                }, req.user)
              return res.render('sign-info', _assign)
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
