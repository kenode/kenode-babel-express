'use strict';

import win from './common/init-window'
import signIn from './actions/sign-in'

$(() => {
  win.Init()
  signIn(null)

})
