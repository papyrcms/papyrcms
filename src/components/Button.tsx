import React, { useState, useEffect } from 'react'

type Props = {
  className: string
  disabled: boolean
  onClick: Function
  id: string
  style: { [key: string]: string }
  title: string
  children: string
  type: string
  submittedText?: string
}

const Button = (props: Props) => {

  const {
    // Standard button props
    className = '',
    disabled = false,
    onClick = () => {},
    id = null,
    style = {},
    title = '',
    children = '',

    // Custom button props
    type = 'primary', // I know type is a standard prop, but it's a stupid standard prop
    submittedText = children
  } = props

  const [buttonDisabled, setButtonDisabled] = useState(disabled)
  const [buttonText, setButtonText] = useState(children)

  // Because use the state "buttonText" instead of children as the actual text,
  // we should update "buttonText" when "children" changes.
  useEffect(() => {
    setButtonText(children)
  }, [children])

  const actualClassName = `button button-${type} ${className}`
  
  const handleClick = (event: any) => {

    setButtonText(submittedText)
    setButtonDisabled(true)

    const reset = () => {
      setButtonText(children)
      setButtonDisabled(false)
    }

    onClick(event, reset)
  }

  return (
    <button
      className={actualClassName}
      disabled={buttonDisabled}
      onClick={handleClick}
      id={id || undefined}
      title={title}
      style={style}
    >
      {buttonText}
    </button>
  )
}


export default Button
