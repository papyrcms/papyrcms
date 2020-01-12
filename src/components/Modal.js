import React, { useState, Fragment } from 'react'


/**
 * Modal renders a button which, when clicked, displays a modal
 *
 * @prop children - Component - The content inside the modal
 * @prop buttonClasses - String - The classes to give the button
 * @prop buttonText - String - The text inside the button
 * @prop image - Boolean - Whether or not this should display an image or content
 * @prop className - String - The className given to the non-modal image
 * @prop alt - String - The alt given to the image
 * @prop src - String - the src of the image
 */
const Modal = props => {

  const { children, buttonClasses, buttonText, className, alt, src, image } = props
  const [hidden, setHidden] = useState(true)

  const renderStandardModal = () => (
    <div>
      <button
        className={buttonClasses}
        onClick={event => {
          event.preventDefault()
          setHidden(false)
        }}
      >
        {buttonText}
      </button>

      <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => setHidden(true)}>
        <div className="modal__box" onClick={event => event.stopPropagation()}>
          <button
            className="modal__close"
            onClick={event => {
              event.preventDefault()
              setHidden(true)
            }}
          >
            &#10005;
          </button>
          <div className="modal__content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )


  const renderImageModal = () => (
    <Fragment>
      <img
        className={`${className || ''} modal__image--clickable`}
        src={src}
        alt={alt || ''}
        onClick={event => {
          event.preventDefault()
          setHidden(false)
        }}
      />

      <div className={`modal${hidden ? ' modal--hidden' : ''}`} onClick={() => setHidden(true)}>
        <div className="modal__image--content" onClick={event => event.stopPropagation()}>
          <button className="modal__close" onClick={() => setHidden(true)}>&#10005;</button>
          <img
            src={src}
            alt={alt || ''}
          />
        </div>
      </div>
    </Fragment>
  )


  if (image) {
    return renderImageModal()
  } else {
    return renderStandardModal()
  }
}


export default Modal
