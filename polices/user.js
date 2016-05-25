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

export default {
  updatePass
}