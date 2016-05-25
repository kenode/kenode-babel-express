'use strict';

import crypto from 'crypto'
import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'
import Tools from '../common/tools'
import { userDao } from '../models'
import userData from '../datatypes/user'
import { sendActiveMail, sendResetPassMail } from '../common/mailer'
import config from '../config'
import uuid from 'node-uuid'
import validator from 'validator'

const userProxy = { 
  newAndSave,
  findByName,
  findById,
  findOne,
  validPassword,
  loginValid,
  updateByName,
  updateOne,
  removeAll,
  localStrategy,
  signUpEmail,
  setUsername,
  activeAccount,
  signForget,
  resetPass,
  updatePass,
  updateAuthPass,
  updataAvatar
}
const UserProxy = Promise.promisifyAll(userProxy)
const resetPassTime = config.reset_pass_time

 /**
 * 创建新用户
 * @param {Object} info
 * @param {Function} callback
 */
function newAndSave (info, callback) {
  let data = userData(info).info
  userDao.create(data, (err, user) => {
    if (err) {
      callback(err)
    }
    else {
      callback(null, user)
    }
  })
}

/**
 * 用户名查找用户
 * @param {String} username
 * @param {Function} callback
 */
function findByName (username, callback) {
  userDao.one({
    username: username
  }, callback)
}

/**
 * 自定义条件查找用户
 * @param {Object} info
 * @param {Function} callback
 */
function findOne (info, callback) {
  userDao.one(info, callback)
}

/**
 * 用户ID查找用户
 * @param {String} uid
 * @param {Function} callback
 */
function findById (uid, callback) {
  userDao.getById(uid, callback)
}

/**
 * 校对密码
 * @param {Function} info
 * @param {Function} callback
 */
function validPassword (info, callback) {
  let encrypt = crypto.createHash('sha1').update(info.pwd + '^' + info.salt).digest('hex')
  callback(null, encrypt === info.encrypt ? true : false)
}

/**
 * 验证登录
 * @param {Object} info
 * @param {Function} callback
 */
function loginValid (info, callback) {
  UserProxy.findOneAsync({
              '$or': [{ 'username': info.username } , { 'email': info.username }]
            })
            .then( doc => {
              if (!doc) {
                Tools.error(1001)
              }
              return UserProxy.validPasswordAsync({
                pwd: info.password,
                encrypt: doc.password,
                salt: doc.salt
              })
            })
            .then( valid => {
              if (!valid) {
                Tools.error(1002)
              }
              return UserProxy.updateOneAsync({
                '$or': [{ 'username': info.username } , { 'email': info.username }]
              }, {
                token_key: Tools.random(32),
                token_time: moment().add(15, 'minutes'),
                update_at: moment()
              })
            })
            .then( _doc => {
              let ds = {
                token_key: _doc.token_key,
                token_time: moment(_doc.token_time).format('x'),
                username: _doc.username,
                email: _doc.email,
                uid: _doc._id,
                update_at: moment(_doc.update_at).format('x'),
                create_at: moment(_doc.create_at).format('x'),
                user_type: _doc.user_type
              };
              callback(null, ds)
            })
            .catch( err => callback(err) )
}

/**
 * 依据用户名更新数据
 * @param {String} username
 * @param {Object} data
 * @param {Function} callback
 */
function updateByName (username, data, callback) {
  userDao.findOne({
    username: username
  }, (err, user) => {
    if (err || !user) {
      return callback(err)
    }
    user = _.assign(user, data)
    user.save(callback)
  })
}

/**
 * 自定义条件更新数据
 * @param {Object} info
 * @param {Object} data
 * @param {Function} callback
 */
function updateOne (info, data, callback) {
  userDao.findOne(info, (err, user) => {
    if (err || !user) {
      return callback(err)
    }
    user = _.assign(user, data)
    user.save(callback)
  })
}

// 清除所有数据
function removeAll (callback) {
  userDao.deleteAll(callback)
}

// passport-loacl
function localStrategy (info, callback) {
  UserProxy.loginValidAsync(info)
            .then( _doc => {
              let user = _.pick(_doc, ['email', 'uid', 'username', 'create_at', 'update_at'])
              return callback(null, user)
            })
            .catch( err =>  callback(err) )
}

// 新用户通过邮箱注册
function signUpEmail (info, callback) {
  UserProxy.findOneAsync({ email: info.email })
            .then( doc => {
              if (doc) {
                Tools.error(1006)
              }
              return UserProxy.newAndSaveAsync(Object.assign(info, { username: info.email }))
            })
            .then( doc => {
              let user = _.pick(doc, ['email', 'uid', 'username', 'create_at', 'update_at'])
              return callback(null, user)
            })
            .catch( err =>  callback(err) )
} 

// 设置用户名
function setUsername (info, callback) {
  UserProxy.updateOneAsync({ email: info.email}, { username: info.username })
            .then( doc => {
              let user = _.pick(doc, ['email', 'uid', 'username', 'create_at', 'update_at'])
              let token = crypto.createHash('sha1').update(doc.email + doc.password + config.session_secret).digest('hex')
              sendActiveMail(user.email, Tools.format(token), user.username)
              return callback(null, user)
            })
            .catch( err =>  callback(err) )
}

// 激活邮箱
function activeAccount (info, callback) {
  UserProxy.findOneAsync({ username: info.name })
            .then( doc => {
              if (!doc) {
                Tools.error(1014)
              }
              let token = crypto.createHash('sha1').update(doc.email + doc.password + config.session_secret).digest('hex')
              if (Tools.format(token) !== info.key) {
                Tools.error(1014)
              }
              if (doc.is_active) {
                Tools.error(1015)
              }
              return UserProxy.updateOneAsync({ username: doc.username}, { is_active: true })
            })
            .then( doc => {
              return callback(null, doc)
            })
            .catch( err =>  callback(err) )
}

// 找回密码
function signForget (info, callback) {
  UserProxy.findOneAsync({
              '$or': [{ 'username': info.username } , { 'email': info.username }]
            })
            .then( doc => {
              if (!doc) {
                Tools.error(1018)
              }
              let retrieveKey  = uuid.v4()
              let retrieveTime = new Date().getTime()
              return UserProxy.updateOneAsync({ email: doc.email}, { 
                retrieve_key: retrieveKey,
                retrieve_time: retrieveTime
              })
            })
            .then( user => {
              sendResetPassMail(user.email, user.retrieve_key, user.username)
              return callback(null, user)
            })
            .catch( err =>  callback(err) )
}

// 重设密码
function resetPass (info, callback) {
  UserProxy.findOneAsync({ username: info.name, retrieve_key: info.key })
            .then( doc => {
              if (!doc) {
                Tools.error(1020)
              }
              let now = new Date().getTime()
              if (!doc.retrieve_time || now - doc.retrieve_time > resetPassTime) {
                Tools.error(1021)
              }
              return callback(null, doc)
            })
            .catch( err =>  callback(err) )
}

// 更新密码
function updatePass (info, callback) {
  UserProxy.findOneAsync({ username: info.name, retrieve_key: info.key })
            .then( doc => {
              if (!doc) {
                Tools.error(1020)
              }
              let now = new Date().getTime()
              if (!doc.retrieve_time || now - doc.retrieve_time > resetPassTime) {
                Tools.error(1021)
              }
              let data = userData({ password: info.password }).info
              return UserProxy.updateOneAsync({ username: doc.username}, { 
                password: data.password,
                salt: data.salt,
                retrieve_key: null,
                retrieve_time: 0,
                is_active: true
              })
            })
            .then( user => {
              return callback(null, user)
            })
            .catch( err =>  callback(err) )
}

// 用户更新密码
function updateAuthPass (info, callback) {
  UserProxy.findOneAsync({ _id: info.uid })
            .then( doc => {
              if (!doc) {
                Tools.error(1027)
              }
              return UserProxy.validPasswordAsync({
                pwd: info.password,
                encrypt: doc.password,
                salt: doc.salt
              })
            })
            .then( valid => {
              if (!valid) {
                Tools.error(1025)
              }
              let data = userData({ password: info.newpass }).info
              return UserProxy.updateOneAsync({ _id: info.uid }, { 
                password: data.password,
                salt: data.salt
              })
            })
            .then( user => {
              return callback(null, user)
            })
            .catch( err => callback(err) )
}

// 更新用户头像
function updataAvatar (info, callback) {
  UserProxy.updateOneAsync({ _id: info.uid}, { avatar: info.avatar})
            .then( user => {
              return callback(null, user)
            })
            .catch( err => callback(err) )
}


export default userProxy
