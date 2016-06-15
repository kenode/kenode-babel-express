

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
  newPost,
  updateByIdPost,
  findByIdPost,
  findByIdDraft,
  findByIdInfo,
  findOneDraft,
  updateByIdInfo
}
const WriterProxy = Promise.promisifyAll(writerProxy)

/*
opts = {
  type: saved
}
*/

function saveDraft (info, opts, callback) {

  if (!opts) {
    // 新建一份草稿
  }

}



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

function findOneDraft (info, callback) {
  draftDao.one(info, callback)
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

export default writerProxy

/*
updateByIdDraft('57568b5fd2347a5d62bac3a7', {
  tags: ['git', 'node.js', 'pm2', 'nginx'],
  content: '## 正文开始www'
}, function(err, draft) {
  if (err) {
    console.log(err)
  }
  else {
    console.log(draft)
  }
})
newDraft({
  titlename: '标题名称',
  tags: ['git', 'node.js', 'pm2'],
  content: '## 正文开始'
}, function(err, draft) {
  if (err) {
    console.log(err)
  }
  else {
    console.log(draft)
  }
})*/