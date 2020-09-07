import React, { useState, useEffect } from 'react'

type Props = {
  children: any
  buttonClasses?: string
  buttonId?: string
  buttonText?: string
  className?: string
  alt?: string
  src?: string
  image?: boolean
  closeId?: string
  onClose?: Function
  onOpen?: Function
}

const Modal = (props: Props) => {
  const {
    children,
    buttonClasses,
    buttonId,
    buttonText,
    className,
    alt,
    src,
    closeId,
    image,
    onClose = () => {},
    onOpen = () => {},
  } = props
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (closeId) {
      const closeButton = document.getElementById(closeId)
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          setHidden(true)
          onClose()
        })
      }
    }
  })

  const renderStandardModal = () => (
    <>
      <button
        id={buttonId}
        className={buttonClasses}
        onClick={(event) => {
          event.preventDefault()
          setHidden(false)
          onOpen()
        }}
        style={
          buttonText
            ? { display: 'inline-block' }
            : { display: 'none' }
        }
      >
        {buttonText}
      </button>

      <div
        className={`modal ${hidden ? 'modal--hidden' : ''}`}
        onClick={() => {
          setHidden(true)
          onClose()
        }}
      >
        <div
          className="modal__box"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="modal__close"
            onClick={(event) => {
              event.preventDefault()
              setHidden(true)
              onClose()
            }}
          >
            &#10005;
          </button>
          <div className={`modal__content ${className}`}>
            {children}
          </div>
        </div>
      </div>
    </>
  )

  const renderImageModal = () => (
    <>
      <img
        className={`${className || ''} modal__image--clickable`}
        src={src}
        alt={alt || ''}
        onClick={(event) => {
          event.preventDefault()
          setHidden(false)
          onOpen()
        }}
      />

      <div
        className={`modal${hidden ? ' modal--hidden' : ''}`}
        onClick={() => {
          setHidden(true)
          onClose()
        }}
      >
        <div
          className="modal__image--content"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="modal__close"
            onClick={() => {
              setHidden(true)
              onClose()
            }}
          >
            &#10005;
          </button>
          <img src={src} alt={alt || ''} />
        </div>
      </div>
    </>
  )

  if (image) {
    return renderImageModal()
  } else {
    return renderStandardModal()
  }
}

export default Modal
