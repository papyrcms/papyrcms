/**
 * Modal renders a button which, when clicked, displays a modal
 * 
 * props includes:
 *   children: Component - The content inside the modal
 *   buttonClasses: String - The classes to give the button
 *   buttonText: String - The text inside the button
 *   image: Boolean - Whether or not this should display an image or content
 *   className: String - The className given to the non-modal image
 *   alt: String - The alt given to the image 
 *   src: String - the src of the image
 */


import React, { Component } from 'react'


class Modal extends Component {

  constructor(props) {

    super(props)

    this.state = { hidden: true }
  }


  renderStandardModal() {

    const { children, buttonClasses, buttonText } = this.props
    const { hidden } = this.state

    return (
      <div>

        <button
          className={buttonClasses}
          onClick={event => {
            event.preventDefault()
            this.setState({ hidden: false })
          }}
        >
          {buttonText}
        </button>

        <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => this.setState({ hidden: true })}>
          <div className="modal__box" onClick={event => event.stopPropagation()}>
            <button className="modal__close" onClick={() => this.setState({ hidden: true })}>&#10005;</button>
            <div className="modal__content">
              {children}
            </div>
          </div>
        </div>

      </div>
    )
  }


  renderImageModal() {

    const { className, alt, src } = this.props
    const { hidden } = this.state

    return (
      <div>

        <img
          className={`${className || ''} modal__image--clickable`}
          src={src}
          alt={alt || ''}
          onClick={event => {
            event.preventDefault()
            this.setState({ hidden: false })
          }}
        />

        <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => this.setState({ hidden: true })}>
          <div className="modal__image--content" onClick={event => event.stopPropagation()}>
            <button className="modal__close" onClick={() => this.setState({ hidden: true })}>&#10005;</button>
            <img
              src={src}
              alt={alt || ''}
            />
          </div>
        </div>

      </div>
    )
  }


  render() {

    if (this.props.image) {
      return this.renderImageModal()
    } else {
      return this.renderStandardModal()
    }
  }
} 


export default Modal
