'use strict';

import { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import request from 'superagent'
import { error } from '../common/tools'
import Message from '../components/message'

const message = new Message({ limit: 1 })

class SettingProfile extends Component {

  constructor (props) {
    super(props)
    this.state = {
      percent: 0,
      type: 'init',
      avatar: '/img/logo-blue-cube.png'
    }
  }

  render () {
    let initDropzone  = <Dropzone onDrop={this._onDrop.bind(this)} className="dropzone">
                          <div>
                            <i className="fa fa-inbox fa-5x" />
                            点击或将图片拖到此区域上传
                          </div>
                        </Dropzone>
    let loadDropzone  = <div className="dropzone">
                          <div>
                            <i className="fa fa-inbox fa-5x" />
                            <div className="progress">
                              <div  className="progress-bar progress-bar-info" 
                                    role="progressbar" 
                                    aria-valuenow="60" 
                                    aria-valuemin="0" 
                                    aria-valuemax="100" 
                                    style={{ width: this.state.percent + '%' }}>
                                {this.state.percent + '%'}
                              </div>
                            </div>
                          </div>
                        </div>
    return (
      <div className="tab-content">
        <form onSubmit={this._submitHandle.bind(this)}>
          <div className="form-group">
            <span>头像</span>
            <div className="avatar">
              <img src={this.state.avatar} />
              { this.state.type === 'load' ? loadDropzone : initDropzone }
            </div>
          </div>
        </form>
      </div>
    )
  }

  _submitHandle (e) {
    e.preventDefault()
  }

  _onDrop (files) {
    console.log('Received files: ', files)
    let that = this
    if (files.length > 1) {
      return message.danger('<strong>Danger!<\/strong> 一次只允许上传一张图片')
    }
    let file = files[0]
    if (!/^image\//.test(file.type)) {
      return message.danger('<strong>Danger!<\/strong> 上传的文件不是图片类型')
    }
    that.setState({ type: 'load' })
    request.post('/upload/avatar')
      .attach(file.name, file)
      .on('progress', e => {
        let _percent = ~~e.percent
        if (that.state.percent < _percent) {
          that.setState({ percent: _percent })
        }
      })
      .end( (err, res) => {
        if (err) {
          that.setState({ percent: 0, type: 'init' })
          return message.danger('<strong>Danger!<\/strong> ' + error(1005).message)
        }
        if (res.statusCode !== 200) {
          that.setState({ percent: 0, type: 'init' })
          return message.danger('<strong>Danger!<\/strong> ' + error(1000).message + res.statusText)
        } 
        if (res.body.code > 0) {
          that.setState({ percent: 0, type: 'init' })
          return message.danger('<strong>Danger!<\/strong> ' + (res.body.message || error(res.body.code).message))
        }
        setTimeout( () => {
          that.setState({ percent: 0, type: 'init', avatar: res.body.data.url })
        }, 3000)
        /**/
      })

  }

}


export default SettingProfile
