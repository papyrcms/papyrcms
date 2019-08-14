import React, { Component } from 'react'


class Modal extends Component {

  constructor(props) {

    super(props)

    this.state = { hidden: props.hidden, boxClicked: false }
  }


  render() {

    const { children } = this.props
    const { hidden } = this.state

    return (
      <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => this.setState({ hidden: true })}>
        <div className="modal__box" onClick={event => event.stopPropagation()}>
          <a className="modal__close" onClick={() => this.setState({ hidden: true })}>&#10005;</a>
          <div className="modal__content">
            {children}
          </div>
        </div>
      </div>
    )
  }
} 


export default Modal