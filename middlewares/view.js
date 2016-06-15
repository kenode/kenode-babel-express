'use strict';

import config from '../config'
import views from '../views/views.json'
import _ from 'lodash'

const assign = (opts, auth = null) => {
  let _assign = {
    title: (opts.title || '$1').replace(/\$1/g, config.name),
    keywords: config.keywords || '',
    description: config.description || '',
    style: views.style[opts.style || 'index'],
    entry: views.entry[opts.entry || 'index'],
    sign: config.sign,
    auth: auth
  }
  if (opts.sign) {
    _assign.sign = Object.assign(config.sign, { active: opts.sign })
  }
  /*if (opts.screen) {
    _assign.screen = opts.screen
  }*/
  _.unset(opts, 'title')
  _.unset(opts, 'style')
  _.unset(opts, 'entry')
  //_.unset(opts, 'screen')
  _.unset(opts, 'sign')
  _.assign(_assign, opts)
  return _assign
}

export default { assign }
