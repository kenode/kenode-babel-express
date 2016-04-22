'use strict';

import win from './common/init-window'
import Article from './common/article-inner'

$(() => {
  win.Init()
  Article.scrollRefresh()

})
