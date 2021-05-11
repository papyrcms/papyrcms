import React, { useState } from 'react'
import Loader from '../Loader'
import styles from './Button.module.scss'

type Props = {
  className?: string
  disabled?: boolean
  onClick: Function
  id?: string
  style?: { [key: string]: string }
  title?: string
  children: string
  type?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'cta'
    | 'edit'
    | 'delete'
}

const Button: React.FC<Props> = (props) => {
  const {
    // Standard button props
    className = '',
    disabled = false,
    onClick = () => {},
    id = null,
    style = {},
    title = '',

    // Custom button props
    type = 'primary', // I know type is a standard prop, but it's a stupid standard prop
  } = props

  const [buttonDisabled, setButtonDisabled] = useState(disabled)
  const [isLoading, setIsLoading] = useState(false)

  const actualClassName = `${styles[type]} ${className || ''}`

  const handleClick = (event: any) => {
    setButtonDisabled(true)
    setIsLoading(true)

    const reset = () => {
      setButtonDisabled(false)
      setIsLoading(false)
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
      {isLoading ? <Loader /> : props.children}
    </button>
  )
}

export default Button
