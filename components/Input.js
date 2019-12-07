import React from 'react'


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
const Input = props => {

  const {
    className, type, placeholder, name,
    id, label, value, onChange,
    onFocus, onBlur, children
  } = props

  const renderLabel = () => {
    if (label) {
      return <label className="input__label" htmlFor={id || ''}>{label}</label>
    }
  }

  return (
    <div className={`input ${className || ''}`}>
      {renderLabel()}
      <input
        type={type || 'text'}
        placeholder={placeholder || ''}
        name={name}
        id={id || ''}
        className="input__input"
        value={value}
        onChange={event => { if (onChange) { onChange(event) } }}
        onBlur={event => { if (onBlur) { onBlur(event) } }}
        onFocus={event => { if (onFocus) { onFocus(event) } }}
      />
      {children || null}
    </div>
  )
}


export default Input