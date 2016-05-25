'use strict';

import config from '../config'
import views from '../views/views.json'
import Promise from 'bluebird'
import userProxy from '../proxy/user'
import Tools from '../common/tools'
import store from '../common/store'
import _ from 'lodash'
import errcode from '../common/error'
import util from 'util'
import { readdirSync } from 'fs'

const UserProxy = Promise.promisifyAll(userProxy)

// 配置
const setting = (req, res, next) => {
  res.render('setting', {
    title: 'Kenode-Babel-Express',
    screen: {
      background: '/img/6YxPs9jXumuuY4EAsAA1.jpg'
    },
    style: views.style['setting'],
    entry: views.entry['setting'],
    sign: config.sign,
    auth: req.user
  })
}

// 更新密码
const updatePass = (data, req, res, next) => {
  UserProxy.updateAuthPassAsync(data)
            .then( user => {
              return res.json({ code: 0, data: '您的密码已经更新。' })
            })
            .catch(Tools.myError, err => {
              return res.json({ code: err.code, data: null })
            })
            .catch( err =>  next(err) )
}

// 上传文件
const upload = (req, res, next) => {
  let isFileLimit = false
  let upload_type = req.params.type || 'other'
  req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.on('limit', () => {
      isFileLimit = true
      let errInfo = _.find(errcode, { code: 1029 })
      errInfo.message = errInfo.message.replace(/\$1/g, config.file_limit)
      return res.json(errInfo)
    })
    let data = { filename: filename, type: upload_type }
    store.upload(file, data, (err, result) => {
      if (err) {
        return next(err)
      }
      if (isFileLimit) {
        return
      }
      UserProxy.updataAvatarAsync({ uid: req.user.uid, avatar: result.url })
                .then( user => {
                  return res.json({ 
                    code: 0, 
                    data: {
                      url: user.avatar
                    }
                  })
                })
                .catch( err => { 
                  readdirSync(result.path)
                  return next(err) 
                })
    })
  })
  req.pipe(req.busboy)
}


export default {
  setting,
  updatePass,
  upload
}