'use strict';

import win from './common/init-window'
import resetPass from './actions/reset-pass'

$(() => {
  win.Init()
  resetPass(null)

})
