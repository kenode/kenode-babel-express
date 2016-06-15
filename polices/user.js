'use strict';

import validator from 'validator'
import Validator from '../common/validator'


const updatePass = (req, res, next) => {
  let data = {
    uid: req.user.uid || '',
    password: req.body.current || '',
    newpass: req.body.newpass || ''
  }
  if (validator.isNull(data.password)) {
    return res.json({ code: 1024, data: null })
  }
  if (validator.isNull(data.newpass)) {
    return res.json({ code: 1022, data: null })
  }
  if (!validator.matches(data.newpass, Validator.user.password.match)) {
    return res.json({ code: 1023, data: null })
  }
  return next(data)
}

const writer = (req, res, next) => {
  let data = {
    uid: req.user.uid || '',
    draft: req.query.draft,
    post: req.query.post,
    type: req.body.type,
    titlename: req.body.title,
    tags: req.body.tags,
    content: req.body.content,
    isnote: req.body.isnote
  }
  if (data.draft && data.draft.length !== 24) {
    return res.json({ code: 1034, data: null })
  }
  if (data.post && data.post.length !== 24) {
    return res.json({ code: 1035, data: null })
  }
  if (data.type === 'publish') {
    if (validator.isNull(data.titlename)) {
      return res.json({ code: 1032, data: null })
    }
    if (validator.isNull(data.content)) {
      return res.json({ code: 1033, data: null })
    }
  }
  return next(data)
}

export default {
  updatePass,
  writer
}