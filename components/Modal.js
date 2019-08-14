import React, { Component } from 'react'


class Modal extends Component {

  render() {

    const { children, hidden, hideModal } = this.props

    return (
      <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => hideModal()}>
        <div className="modal__box" onClick={event => event.stopPropagation()}>
          <a className="modal__close" onClick={() => hideModal()}>&#10005;</a>
          <div className="modal__content">
            {children}
          </div>
        </div>
      </div>
    )
  }
} 


export default Modal