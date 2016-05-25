'use strict';

import { Component, PropTypes } from 'react'

class NavTabs extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    let { menus, tag, refreshState } = this.props
    return (
      <ul className="nav nav-tabs">
      {
        menus.map((menu, i) => {
          return (
            <li key={i}
                className={menu.tag === tag ? 'active' : ''}>
              <a href={'#' + menu.tag} onClick={refreshState.bind(this, menu.tag)}>{menu.name}</a>
            </li>
          )
        })
      }
      </ul>
    )
  }

}

NavTabs.propTypes = {
  menus: PropTypes.array,
  tag: PropTypes.string,
  refreshState: PropTypes.func
}

NavTabs.defaultProps = {
  menus: [],
  tag: 'basic',
  refreshState: () => null
}

export default NavTabs
