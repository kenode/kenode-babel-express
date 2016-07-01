'use strict';

import win from './common/init-window'
import { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import Writer from './components/writer'
import NavBarTop from './components/navbar-top'
import Document from './components/document'
import _ from 'lodash'

$(() => {
  win.Init()

  class App extends Component {

    constructor (props) {
      super(props)
      this.state = {
        type: 'draft',
        alltags: [],
        item: {
          titlename: '',
          tags: [],
          content: '',
          is_note: false,
          type: 'draft'
        },
        updateItem: null,
        newadd: false
      }
    }

    render () {
      return (
        <div className="wraper">
          <Document type={this.state.type}
                    newadd={this.state.newadd}
                    updateItem={this.state.updateItem}
                    refreshState={this._getItem.bind(this)} />
          <div className="bodyer-wrap">
            <NavBarTop  tab={this.state.type}
                        refreshState={this._getNav.bind(this)} />
            <div className="writer-wrap">
              <Writer item={this.state.item}
                      alltags={this.state.alltags}
                      refreshState={this._updateItem.bind(this)} />
            </div>
            <div className="message-wrap" />
          </div>
        </div>
      )
    }

    _getNav (nav) {
      if (nav === 'newadd') {
        this.setState({ 
          item: {
            titlename: '',
            tags: [],
            content: '',
            is_note: false,
            type: 'draft'
          },
          newadd: true
        })
        return
      }
      this.setState({ type: nav })
    }

    _getItem (data) {
      let _item = _.assign(data.item, { type: this.state.type })
      this.setState({ item: _item, alltags: data.alltags, newadd: false })
    }

    _updateItem (data) {
      this.setState({ 
        type: data.type,
        updateItem: data, 
        item: _.assign(data.item, { type: data.type })
      })
    }
  }

  render((<App />), document.getElementById('app'))

})
