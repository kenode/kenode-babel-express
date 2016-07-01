'use strict';

import { Component, PropTypes } from 'react'
import TitleInput from './title-input'
import TagsInput from './tags-input'
import Editor from './editor'
import ButtonGroup from './buttongroup'
import request from 'superagent'
import { error } from '../common/tools'
import Message from './message'
import _ from 'lodash'
import Storage from '../common/storage'
import writerData from '../data/writer'

const WriterStore = new Storage('writer')

const message = new Message({ limit: 1 })


class Writer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _id: undefined,
      title: '',
      tags: [],
      content: '',
      isnote: false,
      type: 'saved',
      alltags: [],
      submit: {
        saved: 'reset',
        publish: 'reset'
      },
      publish: undefined
    }
  }

  componentDidMount () {
    this.setState({ alltags: this.props.alltags })
    WriterStore.set('save', '0')
  }

  componentWillReceiveProps (nextProps) {
    let _item = nextProps.item
    if (_item === this.props.item) {
      //return
    }
    this.setState({ 
      _id: _item._id || undefined,
      title: _item.titlename || '',
      _tags: _item.tags || [],
      content: _item.content || '',
      isnote: _item.is_note || false,
      type: _item.type && _item.type === 'post' ? 'publish' : 'saved',
      alltags: nextProps.alltags,
      submit: { saved: 'reset', publish: 'reset' },
      publish: undefined
    })
    WriterStore.set('save', '0')
  }

  render () {
    let noteContent = (
      <div className="writer-inner">
        <p className="warning">{this.state.publish}</p>
      </div>
    )
    let h2Name = '新建草稿'
    if (this.state._id) {
      h2Name = (this.state.type === 'publish' ? '文章' : '草稿') + ' - ' + this.state._id
    }
    
    let fromContent = (
      <div className="writer-inner">
        <form>
            <h2>{h2Name}</h2>
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
    let _item = this.props.item
    let _search = this.state._id ? '?' + _item.type + '=' + this.state._id : ''
    let action = '/user/writer' + _search
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
        let info = res.body.data
        message.success('<strong>Success!<\/strong> 草稿保存成功')
        setTimeout( () => {
          this.props.refreshState(_.assign(info, { type: 'draft' }))
        }, 1500)
        
      }.bind(this))
  }

  _publish (e) {
    e.preventDefault()
    this.setState({ submit: { saved: 'disabled', publish: 'loading' } })
    let _item = this.props.item
    let _search = this.state._id ? '?' + _item.type + '=' + this.state._id : ''
    let action = '/user/writer' + _search
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
        
        let info = res.body.data
        message.success('<strong>Success!<\/strong> ' + _item.type === 'post' ? '文章已修正' : '文章已发布。')
        setTimeout( () => {
          this.props.refreshState(_.assign(info, { type: 'post' }))
        }, 1500)
      }.bind(this))
  }

  _refreshState (key, val) {
    let temp = {}
    temp[key] = val
    
    this.setState(temp, () => {
      WriterStore.set('save', '0')
      if (this.props.item.titlename !== this.state.title) {
        WriterStore.set('save', '1')
        return
      }
      if (_.toArray(this.props.item.tags) !== this.state.tags) {
        WriterStore.set('save', '1')
        return
      }
      if (this.props.item.content !== this.state.content) {
        WriterStore.set('save', '1')
        return
      }
    })
  }

}

Writer.propTypes = {
  item: PropTypes.object,
  alltags: PropTypes.array,
  refreshState: PropTypes.func
}

Writer.defaultProps = {
  item: '',
  alltags: [],
  refreshState: () => null
}

export default Writer
