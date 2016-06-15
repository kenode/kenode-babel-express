'use strict';

import { Component, PropTypes } from 'react'
import SelectTagsTabItem from './select-tags-tabitem'
import SelectTagBlock from './select-tag-block'


class SelectTags extends Component {

  constructor (props) {
    super(props)
    this.state = {
      tabIndex: 0
    }
  }

  render () {
    return (
      <div className={this.props.selectClass} role="tag-input">
        <ul className="nav nav-pills" role="tag-input">
          {
            this.props.allTags.map((tab, i) => {
              return (
                <SelectTagsTabItem key={i}
                                   name={tab.name}
                                   tabClass={i === this.state.tabIndex ? 'active' : ''}
                                   refreshState={this._tabClick.bind(this, i)} />
              )
            })
          }
        </ul>
        <div className="tab-content" role="tag-input">
          {
            this.props.allTags.map((tab, i) => {
              return (
                <div className={i === this.state.tabIndex ? 'tab-pane active' : 'tab-pane'} 
                     key={i} 
                     role="tag-input">
                  <SelectTagBlock tags={tab.pane}
                                  refreshState={this.props.refreshState} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  _tabClick (index) {
    this.setState({
      tabIndex: index || 0
    })
  }
}

SelectTags.propTypes = {
  allTags: PropTypes.array,
  refreshState: PropTypes.func
}

SelectTags.defaultProps = {
  allTags: [],
  refreshState: () => null
}

export default SelectTags
