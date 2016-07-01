'use strict';

import { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Dialog from 'rc-dialog'


class OperateConfirm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      destroyOnClose: false,
      center: false
    }
  }

  componentDidMount () {
    this.setState({ 
      visible: this.props.visible
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setState({ visible: nextProps.visible })
    }
  }

  render () {
    let dialog = (<div />)
    let okbtn = this.props.okbtn 
              ? <button type="button"
                        className="btn btn-primary"
                        key="save"
                        onClick={this._refreshState.bind(this)} >确认</button>
              : null
    let closebtn = this.props.closebtn 
                  ? <button type="button"
                            className="btn btn-default"
                            key="close"
                            onClick={this._onClose.bind(this)} >取消</button>
                  : null
    let footer = []
    closebtn && footer.push(closebtn)
    okbtn && footer.push(okbtn)
    if (footer.length === 0) {
      footer = null
    } 
    if (this.state.visible) {
      dialog = (
        <Dialog visible={this.state.visible}
                wrapClassName="center"
                animation="zoom"
                maskAnimation="fade"
                onClose={this._onClose.bind(this)}
                style={{ width: this.props.width }}
                title={<div>{this.props.name}</div>}
                footer={footer} >
          {this.props.content}
        </Dialog>
      )
    }
    return dialog
  }

  _onClose () {
    this.setState({ visible: false })
    this.props.refreshState(this.props.tag, false, null)
  }

  _refreshState () {
    this.setState({ visible: false })
    this.props.refreshState(this.props.tag, true, this.props.param)
  }
}



OperateConfirm.propTypes = {
  name: PropTypes.string,
  content: PropTypes.node,
  visible: PropTypes.bool,
  tag: PropTypes.string,
  width: PropTypes.number,
  okbtn: PropTypes.bool,
  closebtn: PropTypes.bool,
  param: PropTypes.object,
  refreshState: PropTypes.func
}

OperateConfirm.defaultProps = {
  name: '',
  content: (<p></p>),
  visible: false,
  tag: '',
  width: 600,
  okbtn: true,
  closebtn: true,
  param: null,
  refreshState: () => null
}

export default OperateConfirm
