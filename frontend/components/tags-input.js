'use strict';

import { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import SelectTags from './select-tags'
import TagItem from './tagitem'

class TagsInput extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selectClass: 'tag-select',
      allTags: props.allTags || [],
      tabIndex: 0
    }
  }

  componentDidMount () {
    let input = findDOMNode(this.refs.input)
    this._initialInputWidth = this._getElementWidth(input)
  }

  _getElementWidth (elem) {
    let rect = elem.getBoundingClientRect()
    return rect.right - rect.left
  }

  render () {
    let tags = this.props.tags
    return (
      <div className="textbox tag-input" 
           role="tag-input" 
           onClick={this._click.bind(this)} 
           onBlur={this._blur.bind(this)}>
        {
          tags.map((tag, i) => {
            let tagClass = !this._findTag(tag) ? 'tag new-tag' : 'tag'
            return (
              <TagItem key={i}
                       name={tag}
                       tagClass={tagClass}
                       refreshState={this._removeTag.bind(this, i)} />
            )
          })
        }
        <input type="text" 
               ref="input" 
               role="tag-input" 
               onKeyDown={this._keyDown.bind(this)} 
               onKeyUp={this._keyUp.bind(this)}
               placeholder="标签，如JavaScript" />
        <SelectTags selectClass={this.state.selectClass}
                  allTags={this.props.allTags}
                  refreshState={this._addTag.bind(this)} />
        <span className="hidden" ref="hidden"></span>
      </div>
    )
  }

  _click () {
    let input = findDOMNode(this.refs.input)
    input.focus()
    if (this.props.allTags.length < 1) return
    if (this.props.allTags.length === 1 && this.props.allTags[0].pane.length < 1) return
    this.setState({
      selectClass: 'tag-select tag-select-show'
    })
  }

  _blur () {
    let that = this
    $(window).on('click', function (e) {
      if ($(e.target).attr('role') !== 'tag-input') {
        that.setState({
          selectClass: 'tag-select'
        })
      }
    })
  }

  _keyDown (e) {
    let input = findDOMNode(this.refs.input)
    switch(e.keyCode) {
      case 188: { // add tag if ','
        e.preventDefault()  // prevent the input of ','
        let val = input.value.trim()
        input.value = ""
        input.style.width = this._initialInputWidth + "px"
        this._addTag(val)
        break
      }
      case 8: { // remove tag if 'del'
        if (input.value == '') this._removeTag()
        break
      }
      default: {
        // dynamic adjust input width
      }
    }
  }

  _keyUp (e) {
    let input = findDOMNode(this.refs.input)
    let hidden = findDOMNode(this.refs.hidden)
    hidden.textContent = input.value
    let wInput = this._getElementWidth(input)
    let wHidden = this._getElementWidth(hidden)
    if (wHidden + 20 > wInput) {
      input.style.width = (wInput + 20) + "px"
    }
  }

  _addTag (tag) {
    let tags = this.props.tags
    if(tag && tags.indexOf(tag) < 0) {
      if (tags.length >= 5) {
        return
      }
      tags.push(tag)
      this.props.refreshState(tags) // change state
    }
  }

  _removeTag (index) {
    let tags = this.props.tags
    if (typeof index == 'undefined') {
      index = tags.length - 1
    }
    tags.splice(index, 1)
    this.props.refreshState(tags) // change state
  }

  _findTag (tag) {
    let allTags = this.props.allTags
    let tags = []
    allTags.map((tab, i) => {
      tags = _.concat(tags, tab.pane)
    })
    return _.indexOf(tags, tag) > -1 ? true : false
  }
}

export default TagsInput
