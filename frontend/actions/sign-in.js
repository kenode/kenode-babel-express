'use strict';

import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'
import Validator from '../../common/validator'

const message = new Message({ limit: 1 })

const signIn = opts => {
  $('.sign-in form [name="username"]').val($.cookie('remember_me'))
                                      .on('keyup', keyupHandle)
  $('.sign-in form').on('submit', submitHandle)
  if (!validator.isNull($.cookie('remember_me'))) {
    $('.sign-in form [name="remember_me"]').attr('checked', true)
  }
}

const submitHandle = evt => {
  evt.preventDefault()
  let $target = $(evt.currentTarget)
  let [$username, $password, $remember_me, $submit, action] = [
    $target.find('[name="username"]'),
    $target.find('[name="password"]'),
    $target.find('[name="remember_me"]:checked'),
    $target.find('[type="submit"]'),
    $target.attr('action')
  ]
  if (validator.isNull($username.val())) {
    $username.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1017).message)
  }
  if (validator.isNull($password.val())) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1009).message)
  }
  let [$btn, Request] = [
    $submit.button('loading'),
    action ? request.get : request.post
  ]
  Request(action || '/sign-in')
    .send({ 
      username: $username.val(), 
      password: $password.val(),
      remember_me: $remember_me.length
    })
    .set('Accept', 'application/json')
    .end( (err, res) => {
      if (err) {
        setTimeout( () => {
          $btn.button('reset')
        }, 5000)
        return message.danger('<strong>Danger!<\/strong> ' + error(1005).message)
      }
      if (res.statusCode !== 200) {
        setTimeout( () => {
          $btn.button('reset')
        }, 5000)
        return message.danger('<strong>Danger!<\/strong> ' + error(1000).message + res.statusText)
      } 
      if (res.body.code > 0) {
        setTimeout( () => {
          $btn.button('reset')
        }, 5000)
        $password.focus()
        return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
      }
      if ($remember_me.length === 1) {
        $.cookie('remember_me', $username.val(), { expires: 365, path: '/' })
      }
      else {
        $.removeCookie('remember_me', { path: '/' })
      }
      window.location.reload()
    })
}

const keyupHandle = evt => {
  if (evt.keyCode === 37 || evt.keyCode === 39) {
    return false
  }
  let $target = $(evt.currentTarget)
  let newVal = $target.val().replace(/\s/g, '')
  $target.val(newVal)
}

export default signIn
