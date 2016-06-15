'use strict';

import { Component, PropTypes } from 'react'

class EditorTopbar extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let refreshState = this.props.refreshState
    return (
      <ul className="md-toolbar clearfix">
        <li className="tb-btn">
          <a title="加粗" onClick={refreshState.bind(this, 'bold')}><i className="fa fa-bold"></i></a>
        </li>
        <li className="tb-btn">
          <a title="斜体" onClick={refreshState.bind(this, 'italic')}><i className="fa fa-italic"></i></a>
        </li>
        <li className="tb-btn spliter"></li>
        <li className="tb-btn">
          <a title="链接" onClick={refreshState.bind(this, 'link')}><i className="fa fa-link"></i></a>
        </li>
        <li className="tb-btn">
          <a title="引用" onClick={refreshState.bind(this, 'blockquote')}><i className="fa fa-outdent"></i></a>
        </li>
        <li className="tb-btn">
          <a title="代码段" onClick={refreshState.bind(this, 'code')}><i className="fa fa-code"></i></a>
        </li>
        <li className="tb-btn">
          <a title="图片" onClick={refreshState.bind(this, 'picture')}><i className="fa fa-picture-o"></i></a>
        </li>
        <li className="tb-btn spliter"></li>
        <li className="tb-btn">
          <a title="有序列表" onClick={refreshState.bind(this, 'ol')}><i className="fa fa-list-ol"></i></a>
        </li>
        <li className="tb-btn">
          <a title="无序列表" onClick={refreshState.bind(this, 'ul')}><i className="fa fa-list-ul"></i></a>
        </li>
        <li className="tb-btn">
          <a title="标题" onClick={refreshState.bind(this, 'header')}><i className="fa fa-header"></i></a>
        </li>
      </ul>
    )
  }

}

EditorTopbar.propTypes = {
  refreshState: PropTypes.func
}

EditorTopbar.defaultProps = {
  refreshState: () => null
}

export default EditorTopbar
