'use strict';

import view from '../middlewares/view'
import Promise from 'bluebird'
import writerProxy from '../proxy/writer'
import _ from 'lodash'
import errcode from '../common/error'
import Markdown from '../common/markdown'

const WriterProxy = Promise.promisifyAll(writerProxy)

// 首页
const Index = (req, res, next) => {
  let query = { recovery: false }
  let select = { _id: 1, titlename: 1, tags: 1, is_note: 1, content: 1, update_at: 1, create_at: 1 }
  let current = 'index'
  switch (req.url) {
    case '/post':
      query.is_note = false
      current = 'post'
      break
    case '/note':
      query.is_note = true
      current = 'note'
      break
    default:
      break
  }
  WriterProxy.getAllPostAsync(query, select, {update_at: -1}, 20, 0)
              .then( doc => {
                let _assign = view.assign(_.assign({
                                title: '$1 - 写文章',
                                style: 'index',
                                entry: 'index',
                                screen: {
                                  background: '/img/6YxPs9jXumuuY4EAsAA1.jpg'
                                },
                                current: current
                              }, {article: doc}), req.user)
                res.render('index', _assign)
              })
              .catch( err =>  next(err) )
}

// 
const postPage = (req, res, next) => {
  console.log(req.params)
  let post_id = req.params.id
  let _assign
  if (!post_id) {
    return res.redirect('/')
  }
  if (post_id.length !== 24) {
    let errInfo = _.find(errcode, { code: 1035 })
    _assign = view.assign({
                title: '$1',
                style: 'page-warning',
                entry: 'page-base',
                current: 'writer',
                warning: errInfo.message
              }, req.user)
    return res.render('page-warning', _assign)
  }

  WriterProxy.findByIdPostAsync(post_id)
              .then( doc => {
                let article = _.pick(doc, ['titlename'])
                article.content = Markdown.render(doc.content)
                _assign = view.assign(_.assign({
                            title: doc.titlename + ' - $1',
                            style: 'post',
                            entry: 'post'
                          }, { article: article }), req.user)
                return res.render('post', _assign)
              })
              .catch( err =>  next(err) )
}


export default {
  Index,
  postPage
}