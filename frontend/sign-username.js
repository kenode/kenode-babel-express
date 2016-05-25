'use strict';

import win from './common/init-window'
import signUsername from './actions/sign-username'

$(() => {
  win.Init()
  signUsername(null)

})
