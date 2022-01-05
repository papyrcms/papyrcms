import { MutableRefObject } from 'react'
import Tooltip from '../Tooltip'
import styles from './Input.module.scss'

interface Props {
  className?: string
  type?: string
  placeholder?: string
  name?: string
  id?: string
  label?: string
  value?: string | number | boolean
  required?: boolean
  onChange?: Function
  onFocus?: Function
  onBlur?: Function
  children?: any
  validation?: string
  tooltip?: string
  refProp?: MutableRefObject<any>
  formState?: Record<string, any>
}

const Input = (props: Props) => {
  // Instantiate props with defaults
  let {
    className = '',
    type = 'text',
    placeholder = '',
    name = '',
    id = name,
    label = '',
    value = '',
    required = false,
    onChange = () => null,
    onFocus = () => null,
    onBlur = () => null,
    children = null,
    validation = '',
    formState,
    tooltip,
    refProp,
  } = props

  // Set formstate vars, but don't overwrite if passed explicitely
  if (formState) {
    if (!value) value = formState.values[name]
    if (!validation) validation = formState.errors[name]
    if (!onChange()) onChange = formState.handleChange
    if (!onBlur()) onBlur = formState.validateField
  }

  // Render label if present
  const renderLabel = () => {
    if (label) {
      return (
        <div className={styles.label}>
          <label htmlFor={id}>
            {label}
            {required && ' *'}
          </label>{' '}
          {tooltip && <Tooltip>{tooltip}</Tooltip>}
        </div>
      )
    }
  }

  // Render the input
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <>
          {renderLabel()}
          <textarea
            ref={refProp}
            key={id}
            placeholder={placeholder}
            name={name}
            id={id}
            className={`${styles.textarea} ${
              validation && styles.invalid
            }`}
            value={value?.toString() || ''}
            required={!!required}
            onChange={(event) => onChange(event)}
            onBlur={(event) => onBlur(event)}
            onFocus={(event) => onFocus(event)}
          />
        </>
      )
    } else if (type === 'checkbox') {
      return (
        <>
          <input
            ref={refProp}
            key={id}
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            className={styles.checkbox}
            checked={!!value}
            required={!!required}
            onChange={(event) => onChange(event)}
            onBlur={(event) => onBlur(event)}
            onFocus={(event) => onFocus(event)}
          />
          {renderLabel()}
        </>
      )
    }

    return (
      <>
        {renderLabel()}
        <input
          ref={refProp}
          key={id}
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          className={`${styles.input} ${
            validation && styles.invalid
          }`}
          value={value?.toString() || ''}
          required={!!required}
          onChange={(event) => onChange(event)}
          onBlur={(event) => onBlur(event)}
          onFocus={(event) => onFocus(event)}
        />
      </>
    )
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {renderInput()}
      <p className={styles.validation}>{validation}</p>
      {children}
    </div>
  )
}

export default Input
