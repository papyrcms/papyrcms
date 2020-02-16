import React, { useContext } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import userContext from '../context/userContext'
import useForm from '../hooks/useForm'
import Input from './Input'


const RegisterForm = props => {

  const { settings } = props
  const { setCurrentUser } = useContext(userContext)

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
  const formState = useForm(INITIAL_STATE)


  const handleSubmit = event => {
    event.preventDefault()

    const success = response => {
      localStorage.setItem('token', response.data.token)
      setCurrentUser(response.data.user)
      Router.push('/profile')
    }

    const error = err => {
      console.error(err.response)
    }

    formState.submitForm('/api/auth/register', { success, error })
  }


  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h3 className="heading-tertiary u-margin-bottom-small">Register</h3>

      <Input
        label="First Name"
        name="firstName"
        formState={formState}
        required
      />

      <Input
        label="Last Name"
        name="lastName"
        formState={formState}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        formState={formState}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        formState={formState}
        required
      />

      <Input
        label="Confirm Password"
        name="passwordConfirm"
        type="password"
        formState={formState}
        required
      />

      <p className="register-form__validation">{formState.values.validation}</p>

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


export default connect(mapStateToProps)(RegisterForm)
