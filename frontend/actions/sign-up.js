'use strict';

import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'
import Validator from '../../common/validator'

const message = new Message({ limit: 1 })

const signUp = opts => {
  $('.sign-up form [type="text"]').on('keyup', keyupHandle)
  $('.sign-up form').on('submit', submitHandle)
}

const submitHandle = evt => {
  evt.preventDefault()
  let $target = $(evt.currentTarget)
  let [$email, $password, $repassword, $submit, action] = [
    $target.find('[name="email"]'),
    $target.find('[name="password"]'),
    $target.find('[name="repassword"]'),
    $target.find('[type="submit"]'),
    $target.attr('action')
  ]
  if (validator.isNull($email.val())) {
    $email.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1007).message)
  }
  if (!validator.isEmail($email.val())) {
    $email.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1008).message)
  }
  if (validator.isNull($password.val())) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1009).message)
  }
  if (!validator.matches($password.val(), Validator.user.password.match)) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1010).message)
  }
  if (validator.isNull($repassword.val())) {
    $repassword.focus()
    return message.warning('<strong>Warning!<\/strong> 确认密码不能为空')
  }
  if ($password.val() !== $repassword.val()) {
    $repassword.focus()
    return message.warning('<strong>Warning!<\/strong> 两次输入的密码不一致')
  }
  let [$btn, Request] = [
    $submit.button('loading'),
    action ? request.get : request.post
  ]
  Request(action || '/sign-up')
    .send({ 
      email: $email.val(), 
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
        $email.focus()
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
  if ($target.attr('name') === 'email') {
    let newVal = $target.val().replace(/\s/g, '')
    $target.val(newVal)
  }
}

export default signUp
