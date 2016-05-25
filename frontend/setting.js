'use strict';

import win from './common/init-window'
import { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import NavTabs from './components/nav-tabs'
import TabContent from './components/tab-content'
import SettingBasic from './pages/setting-basic'
import SettingProfile from './pages/setting-profile'
import SettingSNS from './pages/setting-sns'
import SettingPass from './pages/setting-pass'
import SettingMisc from './pages/setting-misc'
import Storage from './common/storage'

const Page = new Storage('page')

$(() => {
  win.Init()

  const nav_menus = [
    { name: '基础设置', tag: 'basic', content: <SettingBasic /> },
    { name: '个人资料', tag: 'profile', content: <SettingProfile /> },
    { name: '社区帐号', tag: 'sns', content: <SettingSNS /> },
    { name: '修改密码', tag: 'pass', content: <SettingPass /> },
    { name: '其他', tag: 'misc', content: <SettingMisc /> },
  ]

  class Setting extends Component {

    constructor (props) {
      super(props)
      this.state = {
        navTag: Page.get('setting') || 'basic'
      }
    }

    render () {
      let _useNav = _.find(nav_menus, { tag: this.state.navTag })
      return (
        <div className="setting-inner">
          <h2 className="page-title">
            <i className="fa fa-cogs"></i> 设置
          </h2>
          <NavTabs menus={nav_menus} 
                   tag={this.state.navTag}
                   refreshState={this._selectNavItem.bind(this)} />
          <TabContent content={_useNav.content} init={true} />
        </div>
      )
    }

    _selectNavItem (tag, e) {
      e.preventDefault()
      this.setState({ navTag: tag }, () => {
        Page.set('setting', tag)
      })
    }

  }



  render((<Setting />), document.getElementById('setting'))

})
