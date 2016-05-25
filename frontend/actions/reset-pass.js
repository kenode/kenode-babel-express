'use strict';

import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'
import Validator from '../../common/validator'

const message = new Message({ limit: 1 })

const resetPass = opts => {
  $('.reset-pass form').on('submit', submitHandle)
}

const submitHandle = evt => {
  evt.preventDefault()
  let $target = $(evt.currentTarget)
  let [$password, $repassword, $submit, action] = [
    $target.find('[name="password"]'),
    $target.find('[name="repassword"]'),
    $target.find('[type="submit"]'),
    $target.attr('action')
  ]
  if (validator.isNull($password.val())) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1022).message)
  }
  if (!validator.matches($password.val(), Validator.user.password.match)) {
    $password.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1023).message)
  }
  if (validator.isNull($repassword.val())) {
    $repassword.focus()
    return message.warning('<strong>Warning!<\/strong> 确认新密码不能为空')
  }
  if ($password.val() !== $repassword.val()) {
    $repassword.focus()
    return message.warning('<strong>Warning!<\/strong> 两次输入的密码不一致')
  }
  let [$btn, Request] = [
    $submit.button('loading'),
    action ? request.get : request.post
  ]
  Request(action || window.location.href)
    .send({ 
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
        if (_.indexOf([1019, 1020, 1021], res.body.code) >= 0) {
          $('.reset-pass').html('<p>' + error(res.body.code).message + '</p>')
          return false
        }
        setTimeout( () => {
          $btn.button('reset')
        }, 5000)
        $email.focus()
        return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
      }
      $('.reset-pass').html('<p>' + res.body.data + '</p>')
    })

}

export default resetPass
