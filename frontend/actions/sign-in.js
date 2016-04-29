'use strict';

import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'

const message = new Message({ limit: 1 })

const signIn = opts => {
  $('.sign-in form [name="username"]').on('keyup', keyupHandle)
  $('.sign-in form').on('submit', submitHandle)
}

const submitHandle = evt => {
  evt.preventDefault()
  let $target = $(evt.currentTarget)
  let [$username, $password, $submit, action] = [
    $target.find('[name="username"]'),
    $target.find('[name="password"]'),
    $target.find('[type="submit"]'),
    $target.attr('action')
  ]
  if (validator.isNull($username.val())) {
    $username.focus()
    return message.warning('<strong>Warning!<\/strong> 用户名/电子邮件不能为空')
  }
  if (validator.isNull($password.val())) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> 密码不能为空')
  }
  let [$btn, Request] = [
    $submit.button('loading'),
    action ? request.get : request.post
  ]
  Request(action || '/api/v1/sign-in')
    .send({ 
      username: $username.val(), 
      password: $password.val() 
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
