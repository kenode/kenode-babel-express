'use strict';

import { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import cNames from 'classnames'
import Markdown from '../../common/markdown'
import EditorTopbar from './editor-topbar'
import EditorModbar from './editor-modbar'

class Editor extends Component {

  constructor (props) {
    super(props)
    this.state = {
      panelClass: 'md-panel',
      mode: 'split',
      isFullScreen: false,
      name: this.props.name,
      result: Markdown.render(this.props.content)
    }
  }

  componentWillUnmount () {
    this.textControl = null
    this.previewControl = null
  }

  componentDidMount () {
    this.textControl = findDOMNode(this.refs.editor)
    this.previewControl = findDOMNode(this.refs.preview)
    this.textControl.value = this.props.content || ''
  }

  render () {
    let [panelClass, editorClass, previewClass] = [
      cNames(['md-panel', { 'fullscreen': this.state.isFullScreen }]),
      cNames(['md-editor', { 'expand': this.state.mode === 'edit'}]),
      cNames(['md-preview', 'markdown', {
        'expand': this.state.mode === 'preview',
        'shrink': this.state.mode === 'edit'
      }])
    ]
    return (
      <div className={panelClass}>
        <div className="md-menubar">
          <EditorModbar mode={this.state.mode}
                        refreshState={this._changeMode.bind(this)} />
          <EditorTopbar refreshState={this._changeTool.bind(this)} />
        </div>
        <div className={editorClass}>
          <textarea ref="editor"
                    name={this.state.name}
                    onChange={this._onChange.bind(this)}></textarea>
        </div>
        <div ref="preview"
             id="preview"
             className={previewClass}
             dangerouslySetInnerHTML={{ __html: this.state.result }} />
      </div>
    )
  }

  _onChange (e) {
    let htmlStr = Markdown.render(this.textControl.value)
    let outputStr = this.props.output === 'markdown' ? this.textControl.value : htmlStr
    this.props.refreshState(outputStr)
    this.setState({ result: htmlStr }) // change state
  }

  _changeTool (tag) {
    switch (tag) {
      case 'bold': {
        this._preInputText("**加粗文字**", 2, 6)
        break
      }
      case 'italic': {
        this._preInputText("_斜体文字_", 1, 5)
        break
      }
      case 'link': {
        this._preInputText("[链接文本](http://yourlink.com", 1, 5)
        break
      }
      case 'blockquote': {
        this._preInputText("> 引用", 2, 4)
        break
      }
      case 'code': {
        this._preInputText("```\ncode block\n```", 4, 14)
        break
      }
      case 'picture': { 
        this._preInputText("![alt](http://www.yourlink.com)", 2, 5)
        break
      }
      case 'ol': { 
        this._preInputText("1. 有序列表项0\n2. 有序列表项1", 3, 9)
        break
      }
      case 'ul': { 
        this._preInputText("- 无序列表项0\n- 无序列表项1", 2, 8)
        break
      }
      case 'header': { 
        this._preInputText("## 标题", 3, 5)
        break
      }
      default: {
        // 
      }
    }
  }

  _changeMode (tag) {
    if (tag === 'fullscreen') {
      this.setState({ isFullScreen: !this.state.isFullScreen })
      return
    }
    this.setState({ mode: tag })
  }

  _preInputText (text, preStart, preEnd) {
    let [start, end, origin] = [
      this.textControl.selectionStart,
      this.textControl.selectionEnd,
      this.textControl.value
    ]
    if (start !== end) {
      let exist = origin.slice(start, end)
      text = text.slice(0, preStart) + exist + text.slice(preEnd)
      preEnd = preStart + exist.length
    }
    this.textControl.value = origin.slice(0, start) + text + origin.slice(end)
    this.textControl.setSelectionRange(start + preStart, start + preEnd)
    let htmlStr = Markdown.render(this.textControl.value)
    let outputStr = this.props.output === 'markdown' ? this.textControl.value : htmlStr
    this.props.refreshState(outputStr)
    this.setState({ result: htmlStr })
  }
}

Editor.propTypes = {
  output: PropTypes.string,
  content: PropTypes.string,
  refreshState: PropTypes.func
}

Editor.defaultProps = {
  output: undefined,
  content: undefined,
  refreshState: () => null
}

export default Editor
