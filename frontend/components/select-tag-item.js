'use strict';

import { Component, PropTypes } from 'react'

class SelectTagItem extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let [tagName, refreshState] = [
      this.props.name,
      this.props.refreshState
    ]
    return (
      <li role="tag-input">
        <a role="tag-input" 
           onClick={refreshState.bind(this, tagName)}>{tagName}</a>
      </li>
    )
  }
}

SelectTagItem.propTypes = {
  name: PropTypes.string,
  refreshState: PropTypes.func
}

SelectTagItem.defaultProps = {
  name: undefined,
  refreshState: () => null
}

export default SelectTagItem
