'use strict';

import _ from 'lodash'
import crypto from 'crypto'
import Tools from '../common/tools'

const userData = {
  username: '',
  password: Tools.random(8),
  email: ''
}

const encryptPwd = pwd => {
  let salt = _.random(100000, 999999).toString()
  let encrypt = crypto.createHash('sha1').update(pwd + '^' + salt).digest('hex')
  return {
    salt: salt,
    encrypt: encrypt,
    original: pwd
  }
}

const getUserData = info => {
  let [userObj, password] = [
    _.assign(userData, info),
    info && info.password ? encryptPwd(info.password) : encryptPwd(userData.password)
  ]
  userObj.password = password.encrypt;
  userObj.salt = password.salt
  return {
    info: userObj,
    original: {
      password: password.original
    }
  }
}

export default getUserData
