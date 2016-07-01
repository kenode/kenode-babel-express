'use strict';

import _ from 'lodash'
import errcode from './error'
import moment from 'moment'

moment.locale('zh-cn')

const [ran_len, ran_str] = [
 6,
 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
]

function random () {
  let arg = _.zipObject(['len', 'char'], Array.prototype.slice.call(arguments))
  let str_num = typeof arg['len'] === 'number' ? arg['len'] : ran_len
  str_num = typeof arg['len'] === 'object' ? _.random(arg['len'][0], arg['len'][1]) : str_num
  let chars = typeof arg['len'] === 'string' ? arg['len'] : ran_str
  chars = typeof arg['char'] === 'string' && typeof arg['len'] !== 'string' ? arg['char'] : chars
  let str_arr = chars.split("")
  let r_num = str_arr.length
  let str = ''
  for (let i = 0; i < str_num; i++) {
    let pos = Math.floor(Math.random() * r_num)
    str += chars[pos]
  }
  return str
}

const format = (token) => {
  let dd = token.match(/([a-z0-9]{8})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{4})([a-z0-9]{12,24})$/)
  dd.splice(0, 1)
  return _.join(dd, '-')
}

const error = (code) => {
  let [o, e] = [
    _.find(errcode, { code: code }),
    new Error()
  ]
  e.code = o.code
  e.message = o.message
  throw e
}

const myError = (e) => e.code > 1000

const firstImg = (str) => {
  let urls = str.match(/\!\[([a-zA-Z0-9\u2E80-\u9FFF\-\_\s]*)\]\((((http|https:\/\/)|\/\/|\/|\.\/|\.\.\/)[^>]*?.(png|jpg|svg|gif))\)/g)
  if (!urls || urls.length === 0) {
    return null
  }
  let url = urls[0].match(/((http|https:\/\/)|\/\/|\/|\.\/|\.\.\/)[^>]*?.(png|jpg|svg|gif)/)
  return url[0]
}

const moment_to = (date) => {
  return moment(date).fromNow()
}

export default {
  random,
  format,
  error,
  myError,
  firstImg,
  moment_to
}
