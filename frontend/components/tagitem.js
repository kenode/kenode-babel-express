'use strict';

import { Component, PropTypes } from 'react'

class TagItem extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <span className={this.props.tagClass} role="tag-input">
        <span role="tag-input">{this.props.name}</span>
        <i className="fa fa-times" 
           role="tag-input" 
           onClick={this.props.refreshState} />
      </span>
    )
  }
}

TagItem.propTypes = {
  name: PropTypes.string,
  tagClass: PropTypes.string,
  refreshState: PropTypes.func
}

TagItem.defaultProps = {
  name: undefined,
  tagClass: 'tag',
  refreshState: () => null
}

export default TagItem
