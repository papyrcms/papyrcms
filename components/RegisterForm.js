import React from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import useForm from '../hooks/useForm'
import { setCurrentUser } from '../reduxStore'
import Input from './Input'


const RegisterForm = props => {

  const { settings, setCurrentUser } = props

  if (!settings.enableRegistration) {
    return null
  }

  const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    validation: ''
  }
  const {
    values,
    validateField,
    errors,
    handleChange,
    submitForm
  } = useForm(INITIAL_STATE)


  const handleSubmit = event => {

    const success = () => {
      axios.get('/api/currentUser')
      .then(res => {
        setCurrentUser(res.data)
        Router.push('/profile')
      }).catch(err => {
        console.error(err)
      })
    }

    submitForm(event, '/api/register', { success })
  }


  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h3 className="heading-tertiary u-margin-bottom-small">Register</h3>

      <Input
        id="first_name_register_input"
        label="First Name"
        name="firstName"
        value={values.firstName}
        onChange={handleChange}
        onBlur={validateField}
        validation={errors.firstName}
        required
      />

      <Input
        id="last_name_register_input"
        label="Last Name"
        name="lastName"
        value={values.lastName}
        onChange={handleChange}
        onBlur={validateField}
        validation={errors.lastName}
        required
      />

      <Input
        id="email_register_input"
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={validateField}
        validation={errors.email}
        required
      />

      <Input
        id="password_register_input"
        label="Password"
        name="password"
        value={values.password}
        onChange={handleChange}
        type="password"
        onBlur={validateField}
        validation={errors.password}
        required
      />

      <Input
        id="password_confirm_register_input"
        label="Confirm Password"
        name="passwordConfirm"
        value={values.passwordConfirm}
        onChange={handleChange}
        type="password"
        onBlur={validateField}
        validation={errors.passwordConfirm}
        required
      />

      <p className="register-form__validation">{values.validation}</p>

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
