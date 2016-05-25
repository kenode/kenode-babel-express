'use strict';

import config from '../config'
import views from '../views/views.json'

// 首页
const Index = (req, res, next) => {
  res.render('index', {
    title: 'Kenode-Babel-Express',
    screen: {
      background: '/img/6YxPs9jXumuuY4EAsAA1.jpg'
    },
    style: views.style['index'],
    entry: views.entry['index'],
    sign: Object.assign(config.sign, { active: 'sign-in' }),
    auth: req.user
  })
}


export default {
  Index
}