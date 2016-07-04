'use strict';

import { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import validator from 'validator'
import request from 'superagent'
import { error } from '../common/tools'
import _ from 'lodash'
import jsonsql from 'jsonsql'
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem, Divider } from 'rc-menu'
import OperateConfirm from './operate-confirm'
import Storage from '../common/storage'

import Message from './message'


const message = new Message({ limit: 1 })



class Document extends Component {

  constructor (props) {
    super(props)
    this.state = {
      draft: [],
      post: [],
      alltags: [],
      active: { type: 'draft', id: null },
      find: { draft: '', post: '' },
      confirm: {
        key: '',
        name: '',
        content: '',
        width: 600,
        visible: false
      },
      init: true
    }
  }

  componentDidMount () {
    this._getDraftList()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.newadd !== this.props.newadd && nextProps.newadd === true) {
      this.setState({
        active: { type: 'draft', id: null }
      })
    }
    if (nextProps.updateItem !== this.props.updateItem) {
      let info = nextProps.updateItem
      let temp = { 
        alltags: info.alltags,
        active: { type: info.type, id: info.item._id },
        type: info.type
      }
      if (info.type === 'draft') {
        let _draft = this.state.draft
        let _index = _.findIndex(this.state.draft, { _id: info.item._id })
        if (_index >= 0) {
          _draft[_index] = info.item
        }
        else {
          _draft.splice(0, 0, info.item)
        }
        temp.draft = _draft
      }
      if (info.type === 'post') {
        let _post = this.state.post
        let _index = _.findIndex(this.state.post, { _id: info.item._id })
        if (_index >= 0) {
          _post[_index] = info.item
        }
        else {
          _post.splice(0, 0, info.item)
        }
        temp.post = _post
      }
      this.setState(temp)
    }
    if (nextProps.type === this.props.type) {
      return
    }
    if (nextProps.type === 'draft') {
      return this._getDraftList()
    }
    if (nextProps.type === 'post') {
      return this._getPostList()
    }
  }

  render () {
    let _draft = this.state.draft
    let _post = this.state.post
    let _list = this.props.type === 'post' ? _post : _draft
    let _active = this.state.active
    let _find = this.state.find
    let _val = this.props.type === 'post' ? _find.post : _find.draft
    _list = jsonsql(_list, '* where titlename~' + _val)
    return (
      <div className="document-wrap">
        <div className="header">
          <div className="list-group-item">
            <input type="text" 
                   className="form-control" 
                   value={_val}
                   onChange={this._onChange.bind(this)}
                   placeholder="搜索" />
          </div>
        </div>
        <div className="bodyer">
          <div className="list-group">
            {
              _list.map((item, i) => {
                let activeClass = 'list-group-item' + (_active.type === this.props.type && _active.id == item._id ? ' active' : '')
                let menu = (
                  <Menu onClick={this._onSelect.bind(this)}>
                    { this.props.type === 'post' ? (
                        <MenuItem key="tononte" disabled>{item.is_note ? '转为日志' : '转为笔记'}</MenuItem>
                      ) : (
                        <MenuItem key="publish" disabled>直接发布</MenuItem>
                      )
                    }
                    <MenuItem key="recovery">放入回收站</MenuItem>
                    <MenuItem key="remove">彻底删除</MenuItem>
                  </Menu>
                )
                return (
                  <div key={i}
                       className={activeClass}>
                    <a onClick={this._getItemInfo.bind(this, item._id)}>
                      <i className="fa fa-file" aria-hidden="true"></i> {item.titlename || '无标题文章'}</a>
                      
                      {

                        _active.type === this.props.type && _active.id === item._id ? (
                          <Dropdown trigger={['click']} overlay={menu} animation="slide-up">
                            <a onClick={this._openDownMenu.bind(this)}><i className="fa fa-cog" aria-hidden="true"></i></a>
                          </Dropdown>
                        ) : ''
                      }
                      
                  </div>
                )
              })
            }
            <div className="list-group-item">
              <a onClick={this.props.type === 'post' ? this._getPostList.bind(this) : this._getDraftList.bind(this)}>获取更多</a>
              <span />
            </div>
          </div>
          <OperateConfirm name={this.state.confirm.name}
                          tag={this.state.confirm.key}
                          content={this.state.confirm.content}
                          visible={this.state.confirm.visible}
                          width={this.state.confirm.width}
                          param={this.state.confirm.param}
                          refreshState={this._refreshState.bind(this)} />
        </div>
        <div className="footer">
          <div className="list-group-item">
            <a href="/recovery">批量管理</a>
            <a href="/recovery">回收站</a>
          </div>
        </div>
      </div>
    )
  }

  _onChange (evt) {
    let _find = this.state.find
    if (this.props.type === 'post') {
      _find.post = evt.target.value
    }
    else {
      _find.draft = evt.target.value
    }
    this.setState({ find: _find })
  }

  _getDraftList () {
    let _draft = this.state.draft
    request.get('/user/draftapi')
      .query({ limit: _draft.length })
      .set('Accept', 'application/json')
      .end( function(err, res) {
        if (err) {
          return console.log(error(1005).message)
        }
        if (res.statusCode !== 200) {
          return console.log(error(1000).message + res.statusText)
        } 
        if (res.body.code > 0) {
          return console.log(error(res.body.code).message)
        }
        let info = res.body.data
        if (_draft.length > 0) {
          info.list = _.concat(_draft, info.list)
        }
        if (this.state.init) {
          this.props.refreshState({ item: {
              titlename: '',
              tags: [],
              content: '',
              is_note: false,
              type: 'draft'
            }, alltags: info.alltags })
        }
        this.setState({ draft: info.list, alltags: info.alltags, init: false })
      }.bind(this))
  }

  _getPostList () {
    let _post = this.state.post
    request.get('/user/postapi')
      .query({ limit: _post.length })
      .set('Accept', 'application/json')
      .end( function(err, res) {
        if (err) {
          return console.log(error(1005).message)
        }
        if (res.statusCode !== 200) {
          return console.log(error(1000).message + res.statusText)
        } 
        if (res.body.code > 0) {
          return console.log(error(res.body.code).message)
        }
        let info = res.body.data
        if (_post.length > 0) {
          info.list = _.concat(_post, info.list)
        }
        this.setState({ post: info.list, alltags: info.alltags })
      }.bind(this))
  }

  _getItemInfo (id) {
    let _draft = this.state.draft
    let _post = this.state.post
    let _list = this.props.type === 'post' ? _post : _draft
    let info = _.find(_list, {_id: id})
    

    let WriterStore = new Storage('writer')
    let is_current = this.state.active.id === id && this.state.active.type === this.props.type
    
    if (WriterStore.get('save') === '1') {
      return this.setState({
        confirm: {
          key: 'goto',
          name: '保存提示',
          content: (
            <p>{ is_current 
                  ? '当前文章尚未保存，是否重新载入。' 
                  : '当前文章尚未保存，是否遗弃。'}</p>
          ),
          visible: true,
          param: info,
          width: 400
        }
      })
    }
    if (is_current) {
      //return
    }
    
    this.setState({
      active: { type: this.props.type, id: info._id },
      newadd: false,
      dropdown: false
    })
    this.props.refreshState({ item: info, alltags: this.state.alltags })
  }

  _openDownMenu () {
    this.setState({ dropdown: true })
  }

  _onSelect ({key}) {
    let _draft = this.state.draft
    let _post = this.state.post
    let _list = this.props.type === 'post' ? _post : _draft
    let info = {
      type: this.state.active.type,
      item: _.find(_list, {_id: this.state.active.id})
    }
    switch (key) {
      case 'recovery':
        this.setState({
          confirm: {
            key: key,
            name: '删除文章',
            content: (
              <p>确认删除文章《{info.item.titlename || '无标题文章'}》，文章将被移动到回收站，您可以在那里恢复它。60天后将被彻底删除。</p>
            ),
            visible: true
          }
        })
        break
      case 'remove':
        this.setState({
          confirm: {
            key: key,
            name: '删除文章',
            content: (
              <p>确认删除文章《{info.item.titlename || '无标题文章'}》，文章将被彻底删除且不可恢复。</p>
            ),
            visible: true
          }
        })
        break
      default:
        break
    }
  }

  _refreshState (key, confirm, param) {
    if (!confirm) {
      this.setState({
        confirm: {
          key: undefined,
          name: '',
          content: '',
          visible: false
        }
      })
      return
    }
    switch (key) {
      case 'recovery':
        this._removeItem(true)
        break
      case 'remove':
        this._removeItem(false)
        break
      case 'goto':
        this.setState({
          confirm: {
            key: undefined,
            name: '',
            content: '',
            visible: false
          },
          active: { type: this.props.type, id: param._id },
          newadd: false,
          dropdown: false
        })
        this.props.refreshState({ item: param, alltags: this.state.alltags })
        break
      default:
        break
    }
  }

  _removeItem (recovery = true) {
    let _draft = this.state.draft
    let _post = this.state.post
    let _list = this.state.active.type === 'post' ? _post : _draft
    let _index = _.findIndex(_list, {_id: this.state.active.id})
    request.get(recovery ? '/user/recoverapi' : '/user/removeapi')
      .query({ 
        type: this.state.active.type,
        id: this.state.active.id 
      })
      .set('Accept', 'application/json')
      .end( function(err, res) {
        if (err) {
          return console.log(error(1005).message)
        }
        if (res.statusCode !== 200) {
          return console.log(error(1000).message + res.statusText)
        } 
        if (res.body.code > 0) {
          return console.log(error(res.body.code).message)
        }
        if (res.body.data.n < 1) {
          return
        }
        _list.splice(_index, 1)
        let temp = {
            confirm: {
              key: undefined,
              name: '',
              content: '',
              visible: false
            },
            active: { type: this.state.active.type, id: null }
          }
        if (this.state.active.type === 'post') {
          temp.post = _list
        }
        else {
          temp.draft = _list
        }
        this.setState(temp)
        this.props.refreshState({ item: {
            titlename: '',
            tags: [],
            content: '',
            is_note: false,
            type: 'draft'
          }, alltags: this.state.alltags })
      }.bind(this))
  }

}

Document.propTypes = {
  type: PropTypes.string,
  updateItem: PropTypes.object,
  newadd: PropTypes.bool,
  refreshState: PropTypes.func
}

Document.defaultProps = {
  type: 'draft',
  updateItem: null,
  newadd: false,
  refreshState: () => null
}

export default Document
