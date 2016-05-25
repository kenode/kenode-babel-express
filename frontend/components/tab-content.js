'use strict';

import { Component, PropTypes } from 'react'

class TabContent extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return this.props.content
  }

}

TabContent.propTypes = {
  content: PropTypes.node
}

TabContent.defaultProps = {
  content: undefined
}

export default TabContent
