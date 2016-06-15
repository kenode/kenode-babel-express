'use strict';

import { Component, PropTypes } from 'react'
import cNames from 'classnames'

class EditorModbar extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let checkActive = mode => cNames({ active: this.props.mode === mode })
    let refreshState = this.props.refreshState
    return (
      <ul className="md-modebar">
        <li className="tb-btn pull-right">
          <a className={checkActive('preview')} onClick={refreshState.bind(this, 'preview')} title="预览模式">
            <i className="fa fa-eye"></i>
          </a>
        </li>
        <li className="tb-btn pull-right">
          <a className={checkActive('split')} onClick={refreshState.bind(this, 'split')} title="分屏模式">
            <i className="fa fa-columns"></i>
          </a>
        </li>
        <li className="tb-btn pull-right">
          <a className={checkActive('edit')} onClick={refreshState.bind(this, 'edit')} title="编辑模式">
            <i className="fa fa-pencil"></i>
          </a>
        </li>
        <li className="tb-btn spliter pull-right"></li>
        <li className="tb-btn pull-right">
          <a title="全屏模式" onClick={refreshState.bind(this, 'fullscreen')}>
             <i className="fa fa-arrows-alt"></i>
          </a>
        </li>
      </ul>
    );
  }

}

EditorModbar.propTypes = {
  mode: PropTypes.string,
  refreshState: PropTypes.func
}

EditorModbar.defaultProps = {
  mode: undefined,
  refreshState: () => null
}

export default EditorModbar
