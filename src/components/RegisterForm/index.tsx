import { useContext } from 'react'
import Router from 'next/router'
import { useSettings, useUser } from '@/context'
import { useForm } from '@/hooks'
import Input from '../Input'
import Button from '../Button'
import styles from './RegisterForm.module.scss'

const RegisterForm = () => {
  const { settings } = useSettings()
  const { setCurrentUser } = useUser()

  const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    validation: '',
  }
  const formState = useForm(INITIAL_STATE)

  if (!settings.enableRegistration) {
    return null
  }

  const handleSubmit = (event: any, resetButton: Function) => {
    event.preventDefault()

    const success = (response: any) => {
      localStorage.setItem('token', response.data.token)
      setCurrentUser(response.data.user)
      resetButton()
      Router.push('/profile')
    }

    const error = (err: any) => {
      console.error(err.response)
      resetButton()
    }

    formState.submitForm('/api/auth/register', { success, error })
  }

  return (
    <form className={styles.form}>
      <h3 className="heading-tertiary">Register</h3>

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

      <p className={styles.validation}>
        {formState.values.validation}
      </p>

      <div className={styles.submit}>
        <Button onClick={handleSubmit}>Register</Button>
      </div>
    </form>
  )
}

export default RegisterForm
