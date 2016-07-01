'use strict';

import { Component, PropTypes } from 'react'

class TitleInput extends Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="editor-title">
        <input className="textbox" 
               name="title" 
               ref="title" 
               type="text"
               value={this.props.title} 
               onChange={this._onChange.bind(this)}
               placeholder="来，取个响亮的标题吧！" />
      </div>
    )
  }

  _onChange (evt) {
    let refreshState = this.props.refreshState
    refreshState(evt.target.value) // change state
  }
}

TitleInput.propTypes = {
  title: PropTypes.string,
  refreshState: PropTypes.func
}

TitleInput.defaultProps = {
  title: undefined,
  refreshState: () => null
}

export default TitleInput
