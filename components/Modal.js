/**
 * Modal renders a button which, when clicked, displays a modal
 * 
 * props includes:
 *   children: Component - The content inside the modal
 *   buttonClasses: String - The classes to give the button
 *   buttonText: String - The text inside the button
 */


import React, { Component } from 'react'


class Modal extends Component {

  constructor(props) {

    super(props)

    this.state = { hidden: true }
  }


  render() {

    const { children, buttonClasses, buttonText } = this.props
    const { hidden } = this.state

    return (
      <div>
        <button
          className={buttonClasses}
          onClick={event => {
            event.preventDefault()
            this.setState({ hidden: false })}
          }
        >
          {buttonText}
        </button>
        <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => this.setState({ hidden: true })}>
          <div className="modal__box" onClick={event => event.stopPropagation()}>
            <a className="modal__close" onClick={() => this.setState({ hidden: true })}>&#10005;</a>
            <div className="modal__content">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
} 


export default Modal