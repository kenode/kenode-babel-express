'use strict';

import { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

class ButtonGroup extends Component {

  constructor (props) {
    super(props)
    this.state = {
      checked: false,
      publish: '发布文章'
    }
  }

  componentDidMount () {
    this.setState({ checked: this.props.checked })
    if (this.props.type === 'correct') {
      $(findDOMNode(this.refs.isnote)).hide()
      this.setState({ publish: '修正文章' })
    }
  }

  componentWillReceiveProps (nextProps) {
    let {saved, publish} = this.refs
    if (nextProps.submit.saved === 'loading') {
      $(saved).button('loading')
    }
    if (nextProps.submit.publish === 'loading') {
      $(publish).button('loading')
    }
    if (nextProps.submit.saved === 'reset' || nextProps.submit.publish === 'reset') {
      $(saved).button('reset')
      $(publish).button('reset')
    }
  }

  render () {
    let [publishHandle, savedHandle] = [
      this.props.publish,
      this.props.saved
    ]
    return (
      <div className="md-btngroup">
        <div className="foot-right">
          <button className="btn btn-info btn-lg" 
                  ref="saved"
                  disabled={this.props.submit.saved !== 'reset' ? 'disabled' : ''}
                  onClick={savedHandle.bind(this)}>
            <i className="fa fa-floppy-o" aria-hidden="true"></i> 保存草稿
          </button>
          <button className="btn btn-primary btn-lg" 
                  ref="publish"
                  disabled={this.props.submit.publish !== 'reset' ? 'disabled' : ''}
                  onClick={publishHandle.bind(this)}>
            <i className="fa fa-share" aria-hidden="true"></i> 发布文章
          </button>
        </div>
        <div className="foot-left">
          <div className="checkbox" ref="isnote">
            <label>
              <input type="checkbox" 
                     checked={this.state.checked}
                     onChange={this.handleCheckboxChange.bind(this)} /> 作为笔记
            </label>
          </div>
        </div>
      </div>
    )
  }

  handleCheckboxChange (evt) {
    let checkedHandle = this.props.refreshState
    this.setState({ checked: !this.state.checked }, () => {
      checkedHandle(this.state.checked)
    })
  }
}

ButtonGroup.propTypes = {
  publish: PropTypes.func,
  saved: PropTypes.func,
  refreshState: PropTypes.func,
  checked: PropTypes.bool,
  type: PropTypes.string,
  submit: PropTypes.object
}

ButtonGroup.defaultProps = {
  publish: () => null,
  saved: () => null,
  refreshState: () => null,
  checked: false,
  type: 'saved',
  submit: {
    saved: 'reset',
    publish: 'reset'
  }
}

export default ButtonGroup
