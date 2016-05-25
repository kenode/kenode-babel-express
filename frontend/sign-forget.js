'use strict';

import win from './common/init-window'
import signForget from './actions/sign-forget'

$(() => {
  win.Init()
  signForget(null)

})
