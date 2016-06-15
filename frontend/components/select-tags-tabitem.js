'use strict';

import { Component, PropTypes } from 'react'

class SelectTagsTabItem extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <li className={this.props.tabClass} role="tag-input">
        <a role="tag-input" 
           onClick={this.props.refreshState}>{this.props.name}</a>
      </li>
    )
  }
}

SelectTagsTabItem.propTypes = {
  name: PropTypes.string,
  tabClass: PropTypes.string,
  refreshState: PropTypes.func
}

SelectTagsTabItem.defaultProps = {
  name: undefined,
  tabClass: '',
  refreshState: () => null
}

export default SelectTagsTabItem
