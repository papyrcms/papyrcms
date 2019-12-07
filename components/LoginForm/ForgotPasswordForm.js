import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Input from '../Input'


const ForgotPasswordForm = props => {

  const [email, setEmail] = useState(props.email || '')
  const [validation, setValidation] = useState('')
  const [editing, setEditing] = useState(false)


  useEffect(() => {
    if (
      !editing &&
      props.email &&
      email !== props.email
    ) {
      setEmail(props.email)
    }
  })


  const handleSubmit = event => {

    event.preventDefault()

    // Send password reset email
    axios.post('/api/forgotPassword', { email })
      .then(response => {
        setValidation(response.data.message)
      })
      .catch(error => {
        console.error(error)
        setValidation(error.response.data.message)
      })
  }


  return (
    <div className="forgot-password">
      <h3 className="heading-tertiary forgot-password__title">Forgot your password?</h3>

      <p className="forgot-password__content">Nothing to worry about! Just enter your email in the field below, and we'll send you a link so you can reset it.</p>

      <Input
        className="forgot-password__input"
        id="email_forgot_password"
        label="Email"
        name="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        onFocus={() => { if (!editing) setEditing(true) }}
        onBlur={() => { if (editing) setEditing(false) }}
      />

      <p className="forgot-password__validation">{validation}</p>

      <button
        className="button button-primary forgot-password__submit"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  )
}


export default ForgotPasswordForm
