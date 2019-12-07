import React, { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'
import Input from './Input'


const RegisterForm = props => {

  const { settings, setCurrentUser } = props
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [validation, setValidation] = useState('')


  const handleSubmit = event => {

    event.preventDefault()

    axios.post('/api/register', { firstName, lastName, username: email, password, passwordConfirm })
      .then(res => {

        if (res.data.error) {
          setValidation(res.data.error.message)
        } else if (res.data === 'success') {

          axios.get('/api/currentUser')
            .then(res => {
              setCurrentUser(res.data)
              Router.push('/profile')
            }).catch(err => {
              setValidation(err.response.data.message)
            })
        }
      }).catch(err => {
        setValidation(err.response.data.message)
      })
  }


  if (!settings.enableRegistration) {
    return null
  }


  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h3 className="heading-tertiary u-margin-bottom-small">Register</h3>

      <Input
        id="first_name_register_input"
        label="First Name"
        name="firstName"
        value={firstName}
        onChange={event => setFirstName(event.target.value)}
      />

      <Input
        id="last_name_register_input"
        label="Last Name"
        name="lastName"
        value={lastName}
        onChange={event => setLastName(event.target.value)}
      />

      <Input
        id="email_register_input"
        label="Email"
        name="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />

      <Input
        id="password_register_input"
        label="Password"
        name="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        type="password"
      />

      <Input
        id="password_confirm_register_input"
        label="Confirm Password"
        name="passwordConfirm"
        value={passwordConfirm}
        onChange={event => setPasswordConfirm(event.target.value)}
        type="password"
      />

      <p className="register-form__validation">{validation}</p>

      <div className="register-form__submit">
        <input
          type='submit'
          value='Register'
          className='button button-primary'
        />
      </div>
    </form>
  )
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps, { setCurrentUser })(RegisterForm)
