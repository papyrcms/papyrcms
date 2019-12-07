import React, { Component } from 'react'


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
class Input extends Component {

  renderLabel() {

    const { label, id } = this.props

    if (label) {
      return <label className="input__label" htmlFor={id || ''}>{label}</label>
    }
  }


  render() {

    const { className, type, placeholder, name, id, value, onChange, onFocus, onBlur, children } = this.props

    return (
      <div className={`input ${className || ''}`}>
        {this.renderLabel()}
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
}


export default Input