/**
 * Input is a default text-type input component
 * 
 * props include:
 *   id: String - The id and for attributes for the input and label respectively
 *   label: String - The label text
 *   name: String - The name attribute for the input
 *   value: String - The value attribute for the input
 *   onChange: Function - The onChange attribute for the input
 *   placeholder: String - The placeholder attribute for the input
 *   children: Any - Anything additional to add under the input
 *   className: String - Wrapper class
 *   type: String - The type attribute for the input
 */

import React, { Component } from 'react'

class Input extends Component {

  renderLabel() {

    const { label, id } = this.props

    if (label) {
      return <label className="input__label" htmlFor={id || ''}>{label}</label>
    }
  }


  render() {

    const { className, type, placeholder, name, id, value, onChange, children } = this.props

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
          onChange={event => onChange(event)}
        />
        {children || null}
      </div>
    )
  }
}


export default Input