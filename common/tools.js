'use strict';

import _ from 'lodash'
import errcode from './error'

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

const error = (code) => {
  let [o, e] = [
    _.find(errcode, { code: code }),
    new Error()
  ]
  e.code = o.code
  e.message = o.message
  throw e
};

const myError = (e) => e.code > 1000

export default {
  random,
  error,
  myError
}
