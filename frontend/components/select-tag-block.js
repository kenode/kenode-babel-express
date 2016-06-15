'use strict';

import { Component, PropTypes } from 'react'
import SelectTagItem from './select-tag-item'

class SelectTagBlock extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let [tags, refreshState] = [
      this.props.tags,
      this.props.refreshState
    ]
    return (
      <ul className="nav nav-pills" role="tag-input">
        {
          tags.map((name, i) => {
            return (
              <SelectTagItem key={i} 
                             name={name} 
                             refreshState={refreshState.bind(this, name)} />
            );
          })
        }
      </ul>
    )
  }
}

SelectTagBlock.propTypes = {
  tags: PropTypes.array,
  refreshState: PropTypes.func
}

SelectTagBlock.defaultProps = {
  tags: [],
  refreshState: () => null
}

export default SelectTagBlock
