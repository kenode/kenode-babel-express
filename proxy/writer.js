'use strict';

import config from '../config'
import { draftDao, postDao } from '../models'
import draftData from '../datatypes/draft'
import postData from '../datatypes/post'
import writerData from '../datatypes/writer'
import _ from 'lodash'
import Promise from 'bluebird'
import tagsProxy from './tags'
import moment from 'moment'
import Tools from '../common/tools'

const writerProxy = {
  newDraft,
  updateByIdDraft,
  updateDraft,
  newPost,
  updateByIdPost,
  updatePost,
  findByIdPost,
  findByIdDraft,
  findByIdInfo,
  updateByIdInfo,
  getAllPost,
  getAllDraft,
  recoverDraft,
  recoverPost,
  removeDraft,
  removePost,
  clearRecovery
}
const WriterProxy = Promise.promisifyAll(writerProxy)





/**
 * 创建份草稿
 * @param {Object} info
 * @param {Function} callback
 */
function newDraft (info, callback) {
  let data = draftData(info)
  draftDao.create(data, callback)
}

/**
 * 修改指定ID的草稿
 * @param {String} id
 * @param {Object} data
 * @param {Function} callback
 */
function updateByIdDraft (id, data, callback) {
  draftDao.getById(id, (err, doc) => {
    if (err || !doc) {
      return callback(err)
    }
    doc = _.assign(doc, data)
    doc.save(callback)
  })
}

/**
 * 自定义条件修改草稿
 * @param {Object} info
 * @param {Object} data
 * @param {Function} callback
 */
function updateDraft (info, data, callback) {
  draftDao.model.update(info, data, callback)
}

/**
 * 发布新文章
 * @param {Object} info
 * @param {Function} callback
 */
function newPost (info, callback) {
  let data = postData(info)
  postDao.create(data, callback)
}

/**
 * 修改指定ID的文章
 * @param {String} id
 * @param {Object} data
 * @param {Function} callback
 */
function updateByIdPost (id, data, callback) {
  postDao.getById(id, (err, doc) => {
    if (err || !doc) {
      return callback(err)
    }
    doc = _.assign(doc, data)
    doc.save(callback)
  })
}

/**
 * 自定义条件修改文章
 * @param {Object} info
 * @param {Object} data
 * @param {Function} callback
 */
function updatePost (info, data, callback) {
  postDao.model.update(info, data, callback)
}

/**
 * 根据ID获取发布的文章
 * @param {String} id
 * @param {Function} callback
 */
function findByIdPost (id, callback) {
  postDao.getById(id, callback)
}

/**
 * 根据ID获取草稿
 * @param {String} id
 * @param {Function} callback
 */
function findByIdDraft (id, callback) {
  draftDao.getById(id, callback)
}

/**
 * 获取发布文章列表
 * @parma {Object} query
 * @parma {Object} fields
 * @parma {Object} sort
 * @parma {Number} limit
 * @parma {Number} skip
 * @parma {Function} callback
 */
function getAllPost (query, fields, sort, limit, skip, callback) {
  postDao.model.find(query).select(fields).sort(sort).limit(limit).skip(skip).exec(callback)
}

/**
 * 获取草稿列表
 * @parma {Object} query
 * @parma {Object} fields
 * @parma {Object} sort
 * @parma {Number} limit
 * @parma {Number} skip
 * @parma {Function} callback
 */
function getAllDraft (query, fields, sort, limit, skip, callback) {
  draftDao.model.find(query).select(fields).sort(sort).limit(limit).skip(skip).exec(callback)
}


/**
 * 获取文章信息
 * @param {Object} info => { draft: undefined, post: undefined }
 * @param {Function} callback
 */
function findByIdInfo (info, callback) {
  if (info.post) {
    // 从发布里取
    return WriterProxy.findByIdPostAsync(info.post)
                .then( doc => {
                  if (!doc) {
                    Tools.error(1035)
                  }
                  return callback(null, writerData({
                    titlename: doc.titlename,
                    tags: doc.tags,
                    content: doc.content,
                    type: 'correct'
                  }))
                })
                .catch( err => callback(err) )
  }
  if (info.draft) {
    // 从草稿里取
    return WriterProxy.findByIdDraftAsync(info.draft)
                .then( doc => {
                  if (!doc) {
                    Tools.error(1034)
                  }
                  return callback(null, writerData({
                    titlename: doc.titlename,
                    tags: doc.tags,
                    content: doc.content,
                    postid: doc.postid,
                    type: 'publish'
                  }))
                })
                .catch( err => callback(err) )
  }
  return callback(null, writerData())
}

/**
 * 更新文章信息
 */
function updateByIdInfo (info, callback) {
  if (info.type === 'saved') {
    // 保存草稿
    if (info.draft) {
      // 更新保存
      return WriterProxy.updateByIdDraftAsync(info.draft, {
                          titlename: info.titlename,
                          tags: info.tags,
                          content: info.content,
                          update_at: moment()
                        })
                        .then( doc => {
                          tagsProxy.addTags(info.tags)
                          return callback(null, doc)
                        })
                        .catch( err => callback(err) )
    }
    // 全新保存
    return WriterProxy.newDraftAsync({
                        titlename: info.titlename,
                        tags: info.tags,
                        content: info.content,
                        post_id: info.post,
                        user_id: info.uid
                      })
                      .then( doc => {
                        tagsProxy.addTags(info.tags)
                        return callback(null, doc)
                      })
                      .catch( err => callback(err) )
  }
  if (info.type === 'publish') {
    // 发布文章
    if (info.post) {
      // 修正发布
      return WriterProxy.updateByIdPostAsync(info.post, {
                          titlename: info.titlename,
                          tags: info.tags,
                          content: info.content,
                          is_note: info.isnote,
                          update_at: moment()
                        })
                        .then( doc => {
                          tagsProxy.addTags(info.tags)
                          return callback(null, doc)
                        })
                        .catch( err => callback(err) )
    }
    if (info.draft) {
      // 从份草稿里修正发布
      return WriterProxy.findByIdDraftAsync(info.draft)
                        .then( doc => {
                          if (!doc) {
                            Tools.error(1034)
                          }
                          if (!doc.post_id) {
                            return WriterProxy.newPostAsync({
                              titlename: info.titlename,
                              tags: info.tags,
                              content: info.content,
                              is_note: info.isnote,
                              user_id: info.uid
                            })
                          }
                          return WriterProxy.updateByIdPostAsync(doc.post_id, {
                            titlename: info.titlename,
                            tags: info.tags,
                            content: info.content,
                            is_note: info.isnote,
                            update_at: moment()
                          })
                        })
                        .then( doc => {
                          tagsProxy.addTags(info.tags)
                          return callback(null, doc)
                        })
                        .catch( err => callback(err) )
    }
    // 全新发布
    return WriterProxy.newPostAsync({
                        titlename: info.titlename,
                        tags: info.tags,
                        content: info.content,
                        is_note: info.isnote,
                        user_id: info.uid
                      })
                      .then( doc => {
                        tagsProxy.addTags(info.tags)
                        return callback(null, doc)
                      })
                      .catch( err => callback(err) )
  }
}

/**
 * 将草稿放入回收站
 */
function recoverDraft (ids, callback) {
  let conditions  = _.isArray(ids) 
                  ? { _id: { $in: ids } } 
                  : { _id: ids }
  WriterProxy.updateDraftAsync(conditions, {
                recovery: true,
                recover_at: moment()
              })
              .then( doc => {
                return callback(null, doc)
              })
              .catch( err => callback(err) )
}

/**
 * 将已发布文章放入回收站
 */
function recoverPost (ids, callback) {
  let conditions  = _.isArray(ids) 
                  ? { _id: { $in: ids } } 
                  : { _id: ids }
  WriterProxy.updatePostAsync(conditions, {
                recovery: true,
                recover_at: moment()
              })
              .then( doc => {
                return callback(null, doc)
              })
              .catch( err => callback(err) )

}

/**
 * 按条件删除草稿
 */
function removeDraft (ids, callback) {
  let conditions  = _.isArray(ids) 
                  ? { _id: { $in: ids } } 
                  : { _id: ids }
  draftDao.delete(conditions, callback)
}

/**
 * 按条件删除已发布文章
 */
function removePost (ids, callback) {
  let conditions  = _.isArray(ids) 
                  ? { _id: { $in: ids } } 
                  : { _id: ids }
  postDao.delete(conditions, callback)
}

/**
 * 清理回收站
 */
function clearRecovery (callback) {
  let info = { draft: null, post: null }
  WriterProxy.removeDraftAsync({
                recovery: true,
                recover_at: {$lte: moment().add(-(config.recovery || 60), 'days')}
              })
              .then( doc => {
                info.draft = doc.result
                return WriterProxy.removePostAsync({
                  recovery: true,
                  recover_at: {$lte: moment().add(-(config.recovery || 60), 'days')}
                })
              })
              .then( doc => {
                info.post = doc.result
                return callback(null, info)
              })
              .catch( err => callback(err) )
}

export default writerProxy
