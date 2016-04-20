'use strict';

import win from './common/init-window'
import Article from './common/article-list'

$(() => {
  win.Init()
  Article.scrollRefresh()

})
