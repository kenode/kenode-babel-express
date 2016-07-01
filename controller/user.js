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
import auth from '../middlewares/auth'

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
      if (upload_type !== 'avatar') {
        return res.json({ code: 0, data: { url: result.url } })
      }
      UserProxy.updataAvatarAsync({ uid: req.user.uid, avatar: result.url })
                .then( user => {
                  return res.json({ code: 0, data: { url: user.avatar } })
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
  let _assign = view.assign({
                  title: '$1 - 写文章',
                  style: 'writer',
                  entry: 'writer',
                  current: 'writer'
                }, req.user)
  res.render('writer', _assign)
}

// 写文章操作
const writer = (data, req, res, next) => {
  WriterProxy.updateByIdInfoAsync(data)
              .then( doc => {
                if (data.type === 'saved') {
                  return res.json({ code: 0, data: { item: doc, alltags: tagsProxy.loadTags() } })
                }
                if (data.type === 'publish') {
                  return res.json({ code: 0, data: { item: doc, alltags: tagsProxy.loadTags() } })
                }
              })
              .catch( err => next(err) )
}

// 获取草稿列表
const getDraftAPI = (req, res, next) => {
  //?limit=20 skip=>20, limit=>10
  let conditions = { recovery: false }
  let select = { _id: 1, titlename: 1, tags: 1, is_note: 1, content: 1 }
  let isMaster = auth.isMaster(req.user.user_type)
  if (!isMaster) {
    conditions = { recovery: false, user_id: req.user.uid }
  }
  let [limit, skip] = [20, 0]
  if (parseInt(req.query.limit) > 0) {
    limit = 10
    skip = req.query.limit
  }
  WriterProxy.getAllDraftAsync(conditions, select, { create_at: -1 }, limit, skip)
              .then( doc => {
                return res.json({ code: 0, data: { list: doc, alltags: tagsProxy.loadTags() } })
              })
              .catch( err => next(err) )
}

// 获取已发布文章列表
const getPostAPI = (req, res, next) => {
  //?limit=20 skip=>20, limit=>10
  let conditions = { recovery: false }
  let select = { _id: 1, titlename: 1, tags: 1, is_note: 1, content: 1 }
  let isMaster = auth.isMaster(req.user.user_type)
  if (!isMaster) {
    conditions = { recovery: false, user_id: req.user.uid }
  }
  let [limit, skip] = [20, 0]
  if (parseInt(req.query.limit) > 0) {
    limit = 10
    skip = req.query.limit
  }
  WriterProxy.getAllPostAsync(conditions, select, { create_at: -1 }, limit, skip)
              .then( doc => {
                return res.json({ code: 0, data: { list: doc, alltags: tagsProxy.loadTags() } })
              })
              .catch( err => next(err) )
}

// 放入回收站
const recoverAPI = (req, res, next) => {
  let [id, type] = [
      req.query.id,
      req.query.type
    ]
  if (type === 'post') {
    WriterProxy.recoverPostAsync(id)
                .then( doc => {
                  return res.json({ code: 0, data: doc })
                })
                .catch( err => next(err) )
  }
  else {
    WriterProxy.recoverDraftAsync(id)
                .then( doc => {
                  return res.json({ code: 0, data: doc })
                })
                .catch( err => next(err) )
  }
}

// 删除文章
const removeAPI = (req, res, next) => {
  let [id, type] = [
      req.query.id,
      req.query.type
    ]
  if (type === 'post') {
    WriterProxy.removePostAsync({ _id: id})
                .then( doc => {
                  return res.json({ code: 0, data: doc })
                })
                .catch( err => next(err) )
  }
  else {
    WriterProxy.removeDraftAsync({ _id: id})
                .then( doc => {
                  return res.json({ code: 0, data: doc })
                })
                .catch( err => next(err) )
  }
}

export default {
  setting,
  updatePass,
  upload,
  notAuthority,
  writerPage,
  writer,
  getDraftAPI,
  getPostAPI,
  recoverAPI,
  removeAPI
}
