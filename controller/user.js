'use strict';

import config from '../config'
import view from '../middlewares/view'
import Promise from 'bluebird'
import userProxy from '../proxy/user'
import writerProxy from '../proxy/writer'
import Tools from '../common/tools'
import store from '../common/store'
import _ from 'lodash'
import errcode from '../common/error'
import util from 'util'
import { readdirSync } from 'fs'
import writerData from '../datatypes/writer'
import tagsProxy from '../proxy/tags'

const [UserProxy, WriterProxy] = [
    Promise.promisifyAll(userProxy),
    Promise.promisifyAll(writerProxy)
  ]

// 配置
const setting = (req, res, next) => {
  let _assign = view.assign({
                  title: '$1 - 配置',
                  style: 'setting',
                  entry: 'setting',
                  current: 'setting'
                }, req.user)
  res.render('setting', _assign)
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

const notAuthority = (req, res, next) => {
  let errInfo = _.find(errcode, { code: 1030 })
  let _assign = view.assign({
                  title: '$1 - 无权访问',
                  style: 'page-warning',
                  entry: 'page-base',
                  warning: errInfo.message
                }, req.user)
  res.render('page-warning', _assign)
}

// 写文章页面
const writerPage = (req, res, next) => {
  // 新建草稿/帖子
  // 编辑现有草稿 ?draft＝1293393030
  // 编辑现有帖子 ?post=91203233003
  //console.log(writerData())
  let info = {
    draft: req.query.draft,
    post: req.query.post
  }
  let errInfo, _assign
  if (info.draft && info.draft.length !== 24) {
    errInfo = _.find(errcode, { code: 1034 })
  }
  if (info.post && info.post.length !== 24) {
    errInfo = _.find(errcode, { code: 1035 })
  }
  if (errInfo) {
    _assign = view.assign({
                title: '$1 - 写文章',
                style: 'page-warning',
                entry: 'page-base',
                current: 'writer',
                warning: errInfo.message
              }, req.user)
    return res.render('page-warning', _assign)
  }
  WriterProxy.findByIdInfoAsync(info)
              .then( doc => {
                _assign = view.assign(_.assign({
                            title: '$1 - 写文章',
                            style: 'writer',
                            entry: 'writer',
                            current: 'writer'
                          }, doc), req.user)
                return res.render('writer', _assign)
              })
              .catch(Tools.myError, err => {
                errInfo = _.find(errcode, { code: err.code })
                _assign = view.assign({
                            title: '$1 - 写文章',
                            style: 'page-warning',
                            entry: 'page-base',
                            current: 'writer',
                            warning: errInfo.message
                          }, req.user)
                res.render('page-warning', _assign)
              })
              .catch( err =>  next(err) )
}

// 写文章操作
const writer = (data, req, res, next) => {
  WriterProxy.updateByIdInfoAsync(data)
              .then( doc => {
                if (data.type === 'saved') {
                  return res.json({ code: 0, data: { id: doc._id, alltags: tagsProxy.loadTags() } })
                }
                if (data.type === 'publish') {
                  return res.json({ code: 0, data: data.post ? '文章已修正' : '文章已发布。' })
                }
              })
              .catch( err =>  next(err) )
}


export default {
  setting,
  updatePass,
  upload,
  notAuthority,
  writerPage,
  writer
}
