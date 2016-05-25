'use strict';

import { Component, PropTypes } from 'react'
import request from 'superagent'
import validator from 'validator'
import { error } from '../common/tools'
import Message from '../components/message'
import Validator from '../../common/validator'

const message = new Message({ limit: 1 })

class SettingPass extends Component {

  constructor (props) {
    super(props)
    this.state = { init: true, note: null }
  }

  componentDidMount () {
    this.setState({ init: true, note: null })
  }

  render () {
    let noteContent = <p>{this.state.note}</p>
    let fromContent = (
      <form onSubmit={this._submitHandle.bind(this)}>
        <div className="form-group">
          <label>
            <span>当前密码</span>
            <input type="password" 
                   className="form-control input-lg" 
                   ref="current" />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>新密码</span>
            <input type="password" 
                   className="form-control input-lg" 
                   ref="newpass" />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>确认密码</span>
            <input type="password" 
                   className="form-control input-lg" 
                   ref="confirmation" />
          </label>
        </div>
        <button className="btn btn-primary btn-lg" 
                type="submit" 
                data-loading-text="提交中..."
                ref="submit">保存</button>
      </form>
    )
    let _content = this.state.init ? fromContent : noteContent
    return (
      <div className="tab-content">
        {_content}
      </div>
    )
  }

  _submitHandle (e) {
    e.preventDefault()
    let { current, newpass, confirmation } = this.refs
    if (validator.isNull(current.value)) {
      current.focus()
      return message.warning('<strong>Warning!<\/strong> ' + error(1024).message)
    }
    if (validator.isNull(newpass.value)) {
      newpass.focus()
      return message.warning('<strong>Warning!<\/strong> ' + error(1022).message)
    }
    if (!validator.matches(newpass.value, Validator.user.password.match)) {
      newpass.focus()
      return message.warning('<strong>Warning!<\/strong> ' + error(1023).message)
    }
    if (validator.isNull(confirmation.value)) {
      confirmation.focus()
      return message.warning('<strong>Warning!<\/strong> 确认密码不能为空')
    }
    if (newpass.value !== confirmation.value) {
      confirmation.focus()
      return message.warning('<strong>Warning!<\/strong> 两次输入的密码不一致')
    }
    this._sendHandle()
  }

  _sendHandle () {
    let { current, newpass, submit } = this.refs
    $(submit).button('loading')
    request.post('/update-pass')
      .send({ 
        current: current.value, 
        newpass: newpass.value 
      })
      .set('Accept', 'application/json')
      .end( function(err, res) {
        if (err) {
          setTimeout( () => {
            $(submit).button('reset')
          }, 5000)
          return message.danger('<strong>Danger!<\/strong> ' + error(1005).message)
        }
        if (res.statusCode !== 200) {
          setTimeout( () => {
            $(submit).button('reset')
          }, 5000)
          return message.danger('<strong>Danger!<\/strong> ' + error(1000).message + res.statusText)
        } 
        if (res.body.code > 0) {
          setTimeout( () => {
            $(submit).button('reset')
          }, 5000)
          if (res.body.code === 1024) {
            current.focus()
          }
          else {
            newpass.focus()
          }
          return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
        }
        this.setState({ init: false, note: res.body.data })
      }.bind(this))
  }

}



export default SettingPass
