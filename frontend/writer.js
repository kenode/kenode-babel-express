'use strict';

import win from './common/init-window'
import { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import TitleInput from './components/title-input'
import TagsInput from './components/tags-input'
import Editor from './components/editor'
import ButtonGroup from './components/buttongroup'
import request from 'superagent'
import { error } from './common/tools'
import Message from './components/message'

const message = new Message({ limit: 1 })
const tags = JSON.parse($('#writer [name="tags"]').val() || '[]')
const title = $('#writer [name="title"]').val()
const allTags = JSON.parse($('#writer [name="alltags"]').val() || '[]')
const content = $('#writer [name="content"]').val()
const submit = JSON.parse($('#writer [name="submit"]').val() || '{}')
const action = window.location.pathname + window.location.search
//const isnote = $('#writer [name="isnote"]').val() === 'true' ? true : false

$(() => {
  win.Init()

  class Writer extends Component {

    constructor () {
      super()
      this.state = {
        title: title || '',
        tags: tags || [],
        content: content || '',
        isnote: submit.isnote || false,
        type: submit.type || 'saved',
        alltags: allTags || [],
        submit: {
          saved: 'reset',
          publish: 'reset'
        },
        publish: undefined
      }
    }

    render () {
      let noteContent = (
        <div className="writer-inner">
          <p className="warning">{this.state.publish}</p>
        </div>
      )
      let fromContent = (
        <div className="writer-inner">
          <form>
            <h2>写文章</h2>
            <TitleInput title={this.state.title} 
                        refreshState={this._refreshState.bind(this, 'title')} />
            <TagsInput tags={this.state.tags} 
                       allTags={this.state.alltags} 
                       refreshState={this._refreshState.bind(this, 'tags')} />
            <Editor output="markdown" 
                    content={this.state.content} 
                    refreshState={this._refreshState.bind(this, 'content')} />
            <ButtonGroup saved={this._saved.bind(this)}
                         publish={this._publish.bind(this)}
                         refreshState={this._refreshState.bind(this, 'isnote')}
                         checked={this.state.isnote}
                         type={this.state.type}
                         submit={this.state.submit} />
          </form>
        </div>
      )
      return this.state.publish ? noteContent : fromContent
    }

    _saved (e) {
      e.preventDefault()
      this.setState({ submit: { saved: 'loading', publish: 'disabled' } })
      request.post(action)
        .send(Object.assign(this.state, { type: 'saved' }))
        .set('Accept', 'application/json')
        .end( function(err, res) {
          if (err) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(1005).message)
          }
          if (res.statusCode !== 200) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(1000).message + res.statusText)
          } 
          if (res.body.code > 0) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
          }
          setTimeout( () => {
            this.setState({ submit: { saved: 'reset', publish: 'reset' } })
          }, 3000)
          this.setState({ alltags: res.body.data.alltags })
          if (window.location.search !== '?draft=' + res.body.data.id) {
            window.location.href = '/writer?draft=' + res.body.data.id
          }
        }.bind(this))
    }

    _publish (e) {
      e.preventDefault()
      this.setState({ submit: { saved: 'disabled', publish: 'loading' } })
      request.post(action)
        .send(Object.assign(this.state, { type: 'publish' }))
        .set('Accept', 'application/json')
        .end( function(err, res) {
          if (err) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(1005).message)
          }
          if (res.statusCode !== 200) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(1000).message + res.statusText)
          } 
          if (res.body.code > 0) {
            setTimeout( () => {
              this.setState({ submit: { saved: 'reset', publish: 'reset' } })
            }, 3000)
            return message.danger('<strong>Danger!<\/strong> ' + error(res.body.code).message)
          }
          this.setState({ publish: res.body.data })
        }.bind(this))
    }

    _refreshState (key, val) {
      let temp = {}
      temp[key] = val
      this.setState(temp)
    }

  }

  render((<Writer />), document.getElementById('writer'))

})
