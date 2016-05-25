'use strict';

import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'
import Validator from '../../common/validator'

const message = new Message({ limit: 1 })

const signForget = opts => {
  $('.sign-forget form [name="username"]').on('keyup', keyupHandle)
  $('.sign-forget form').on('submit', submitHandle)
}


const submitHandle = evt => {
  evt.preventDefault()
  let $target = $(evt.currentTarget)
  let [$username, $submit, action] = [
    $target.find('[name="username"]'),
    $target.find('[type="submit"]'),
    $target.attr('action')
  ]
  if (validator.isNull($username.val())) {
    $username.focus()
    return message.warning('<strong>Warning!<\/strong> ' + error(1017).message)
  }
  let [$btn, Request] = [
    $submit.button('loading'),
    action ? request.get : request.post
  ]
  Request(action || '/sign-forget')
    .send({ 
      username: $username.val()
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
        $username.focus()
        return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
      }
      // 显示邮件已发送信息
      $('.sign-forget').html('<p>' + res.body.data + '</p>')
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

export default signForget
