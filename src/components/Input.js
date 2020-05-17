import React, { Fragment } from 'react'


/**
 * Input is a default text-type input component
 *
 * @prop id - String - The id and for attributes for the input and label respectively
 * @prop label - String - The label text
 * @prop name - String - The name attribute for the input
 * @prop value - String - The value attribute for the input
 * @prop onChange - Function - The onChange attribute for the input
 * @prop onFocus - Function - The onFocus attribute for the input
 * @prop onBlur - Function - The onBlur attribute for the input
 * @prop placeholder - String - The placeholder attribute for the input
 * @prop children - Any - Anything additional to add under the input
 * @prop className - String - Wrapper class
 * @prop type - String - The type attribute for the input
 */
const Input = (props) => {

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
    formState
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
      return <label className="input__label" htmlFor={id}>
        {label}{required && ' *'}
      </label>
    }
  }


  // Render the input
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <Fragment>
          {renderLabel()}
          <textarea
            placeholder={placeholder}
            name={name}
            id={id}
            className={`input__textarea ${validation && 'input__textarea--invalid'}`}
            value={value}
            required={!!required}
            onChange={event => onChange(event)}
            onBlur={event => onBlur(event)}
            onFocus={event => onFocus(event)}
          />
        </Fragment>
      )

    } else if (type === 'checkbox') {
      return (
        <Fragment>
          <input
            type={type}
            placeholder={placeholder}
            name={name}
            id={id}
            className="input__checkbox"
            checked={!!value}
            required={!!required}
            onChange={event => onChange(event)}
            onBlur={event => onBlur(event)}
            onFocus={event => onFocus(event)}
          />
          {renderLabel()}
        </Fragment>
      )
    }

    return (
      <Fragment>
        {renderLabel()}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          className={`input__input ${validation && 'input__input--invalid'}`}
          value={value}
          required={!!required}
          onChange={event => onChange(event)}
          onBlur={event => onBlur(event)}
          onFocus={event => onFocus(event)}
      />
      </Fragment>
    )
  }


  return (
    <div className={`input ${className}`}>
      {renderInput()}
      <p className="input__validation">{validation}</p>
      {children}
    </div>
  )
}


export default Input