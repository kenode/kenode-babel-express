'use strict';

import view from '../middlewares/view'

// 首页
const Index = (req, res, next) => {
  let _assign = view.assign({
                  screen: {
                    background: '/img/6YxPs9jXumuuY4EAsAA1.jpg'
                  }
                }, req.user)
  res.render('index', _assign)
}


export default {
  Index
}