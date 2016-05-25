'use strict';

import validator from 'validator'
import Promise from 'bluebird'
import userProxy from '../proxy/user'
import _ from 'lodash'
import errcode from '../common/error'
import config from '../config'
import views from '../views/views.json'

const UserProxy = Promise.promisifyAll(userProxy)

const signIn = (req, res, next) => {
  let data = {
    username: req.body.username.replace(/\s/g, '') || '',
    password: req.body.password || ''
  }
  if (validator.isNull(data.username) || validator.isNull(data.password)) {
    return res.json({
      code: 1003,
      data: null
    })
  }
  return next(data)
}

const signUp = (req, res, next) => {
  let data = {
    email: req.body.email.replace(/\s/g, '') || '',
    password: req.body.password || ''
  }
  if (validator.isNull(data.email)) {
    return res.json({ code: 1007, data: null })
  }
  if (!validator.isEmail(data.email)) {
    return res.json({ code: 1008, data: null })
  }
  if (validator.isNull(data.password)) {
    return res.json({ code: 1009, data: null })
  }
  if (!validator.matches(data.password, /^[a-zA-Z0-9_-]{6,18}$/i)) {
    return res.json({ code: 1010, data: null })
  }
  return next(data)
}

const signUsername = (req, res, next) => {
  let data = {
    username: req.body.username.replace(/\s/g, '') || '',
    email: req.user.email
  }
  if (validator.isNull(data.username)) {
    return res.json({ code: 1016, data: null })
  }
  if (!validator.matches(data.username, /^[a-zA-Z0-9_]{4,12}$/i)) {
    return res.json({ code: 1011, data: null })
  }
  return next(data)
}

const activeAccount = (req, res, next) => {
  let data = {
    key: req.query.key.replace(/\s/g, '') || '',
    name: req.query.name.replace(/\s/g, '') || ''
  }
  if (validator.isNull(data.key) || validator.isNull(data.name)) {
    let errInfo = _.find(errcode, { code: 1013 })
    return res.render('sign-info', {
      title: 'Kenode-Babel-Express',
      style: views.style['sign-inner'],
      entry: views.entry['page-base'],
      sign: Object.assign(config.sign, { active: 'sign-info' }),
      signInfo: {
        title: '激活邮箱',
        content: errInfo.message
      }
    })
  }
  return next(data)
}

const signForget = (req, res, next) => {
  let data = {
    username: req.body.username.replace(/\s/g, '') || ''
  }
  if (validator.isNull(data.username)) {
    return res.json({ code: 1017, data: null })
  }
  return next(data)
}

const resetPass = (req, res, next) => {
  let data = {
    key: validator.trim(req.query.key || ''),
    name: validator.trim(req.query.name || '')
  }
  if (validator.isNull(data.key) || validator.isNull(data.name)) {
    let errInfo = _.find(errcode, { code: 1019 })
    return res.render('sign-info', {
      title: 'Kenode-Babel-Express',
      style: views.style['sign-inner'],
      entry: views.entry['page-base'],
      sign: Object.assign(config.sign, { active: 'sign-info' }),
      signInfo: {
        title: '重置密码',
        content: errInfo.message
      }
    })
  }
  return next(data)
}

const updatePass = (req, res, next) => {
  let data = {
    key: validator.trim(req.query.key || ''),
    name: validator.trim(req.query.name || ''),
    password: req.body.password || ''
  }
  if (validator.isNull(data.key) || validator.isNull(data.name)) {
    return res.json({ code: 1019, data: null })
  }
  if (validator.isNull(data.password)) {
    return res.json({ code: 1022, data: null })
  }
  if (!validator.matches(data.password, /^[a-zA-Z0-9_-]{6,18}$/i)) {
    return res.json({ code: 1023, data: null })
  }
  return next(data)
}

export default {
  signIn,
  signUp,
  signUsername,
  activeAccount,
  signForget,
  resetPass,
  updatePass
}
