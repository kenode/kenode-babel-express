'use strict';

import config from '../config'
import views from '../views/views.json'

// 登录页面
const signInPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-in') {
    return res.redirect('/')
  }
  res.render('sign-in', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-in'],
    entry: views.entry['sign-in'],
    sign: Object.assign(config.sign, { active: 'sign-in' })
  })
}

// 注册页面
const signUpPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-up') {
    return res.redirect('/')
  }
  res.render('sign-up', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-up'],
    entry: views.entry['sign-up'],
    sign: Object.assign(config.sign, { active: 'sign-up' })
  })
}

// 密码找回页面
const signForgetPage = (req, res, next) => {
  if (req.user && req.route.path === '/sign-forget') {
    return res.redirect('/')
  }
  res.render('sign-forget', {
    title: 'Kenode-Babel-Express',
    style: views.style['sign-forget'],
    entry: views.entry['sign-forget'],
    sign: Object.assign(config.sign, { active: 'sign-forget' })
  })
}

export default {
  signInPage,
  signUpPage,
  signForgetPage
}