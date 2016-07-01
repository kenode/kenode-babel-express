'use strict';

import { Component, PropTypes } from 'react'
import _ from 'lodash'

class NavBarTop extends Component {

  constructor (props) {
    super(props)
    this.state = {
      navs: [
        { name: '草稿', tag: 'draft' },
        { name: '已发布', tag: 'post' }
      ],
      active: 0
    }
  }

  render () {
    let _navs = this.state.navs
    let _active = _.findIndex(_navs, { tag: this.props.tab })
    return (
      <div className="navbar-top">
        <div className="nav-group">
          <a onClick={this._selectNav.bind(this, -1)}>新建</a>
          {
            _navs.map( (nav, i) => {
              return (
                <a key={i} 
                   className={_active === i ? 'active' : ''}
                   onClick={this._selectNav.bind(this, i)}>{nav.name}</a>
              )
            })
          }
        </div>
        <div className="menu">
          <i className="fa fa-align-justify" data-menubar="menu"></i>
        </div>
      </div>
    )
  }

  _selectNav (index) {
    if (index === -1) {
      this.props.refreshState('newadd')
      return
    }
    this.setState({ active: index })
    this.props.refreshState(this.state.navs[index].tag)
  }

}

NavBarTop.propTypes = {
  tab: PropTypes.string,
  refreshState: PropTypes.func
}

NavBarTop.defaultProps = {
  tab: 'draft',
  refreshState: () => null
}

export default NavBarTop
