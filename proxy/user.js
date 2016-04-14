'use strict';

import crypto from 'crypto'
import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'
import Tools from '../common/tools'
import { userDao } from '../models'
import userData from '../datatypes/user'

const userProxy = { 
  newAndSave,
  findByName,
  findById,
  validPassword,
  loginValid,
  updateByName,
  removeAll,
  localStrategy
}
const _userProxy = Promise.promisifyAll(userProxy)


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
  _userProxy.findByNameAsync(info.username)
            .then( doc => {
              if (!doc) {
                Tools.error(1001)
              }
              return _userProxy.validPasswordAsync({
                pwd: info.password,
                encrypt: doc.password,
                salt: doc.salt
              })
            })
            .then( valid => {
              if (!valid) {
                Tools.error(1002)
              }
              return userProxy.updateByNameAsync(info.username, {
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

// 清除所有数据
function removeAll (callback) {
  userDao.deleteAll(callback)
}

// passport-loacl
function localStrategy (info, callback) {
  _userProxy.loginValidAsync(info)
            .then( _doc => {
              let user = _.pick(_doc, ['email', 'uid', 'username', 'create_at', 'update_at'])
              return callback(null, user)
            })
            .catch(Tools.myError, () => 
              callback(null, false, { message: 'Incorrect username Or password.' })
            )
            .catch( err =>  callback(err) )
}

export default userProxy
