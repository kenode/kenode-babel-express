'use strict';

import win from './common/init-window'
import signUp from './actions/sign-up'

$(() => {
  win.Init()
  signUp(null)

})
