import React, { useContext } from 'react'
import Router from 'next/router'
import settingsContext from '@/context/settingsContext'
import userContext from '@/context/userContext'
import useForm from '@/hooks/useForm'
import Input from './Input'
import Button from './Button'


const RegisterForm = () => {

  const { settings } = useContext(settingsContext)
  const { setCurrentUser } = useContext(userContext)

  const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    validation: ''
  }
  const formState = useForm(INITIAL_STATE)

  if (!settings.enableRegistration) {
    return null
  }  

  const handleSubmit = (event, resetButton) => {
    event.preventDefault()

    const success = (response) => {
      localStorage.setItem('token', response.data.token)
      setCurrentUser(response.data.user)
      resetButton()
      Router.push('/profile')
    }

    const error = (err) => {
      console.error(err.response)
      resetButton()
    }

    formState.submitForm('/api/auth/register', { success, error })
  }


  return (
    <form className="register-form">
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
        id="register-email"
        type="email"
        formState={formState}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        id="register-password"
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
        <Button
          onClick={handleSubmit}
          submittedText="Submitting"
        >
          Register
        </Button>
      </div>
    </form>
  )
}


export default RegisterForm
