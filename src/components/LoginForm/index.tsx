import React, { useContext } from 'react'
import Router from 'next/router'
import { userContext } from '@/context'
import { useForm } from '@/hooks'
import Input from '../Input'
import Button from '../Button'
import Modal from '../Modal'
import ForgotPasswordForm from './ForgotPasswordForm'
import styles from './LoginForm.module.scss'

const LoginForm = () => {
  const { setCurrentUser } = useContext(userContext)
  const INITIAL_STATE = {
    email: '',
    password: '',
    validation: '',
  }
  const formState = useForm(INITIAL_STATE)

  const handleSubmit = (event: any, resetButton: Function) => {
    event.preventDefault()

    const success = (res: any) => {
      localStorage.setItem('token', res.data.token)
      setCurrentUser(res.data.user)
      Router.push('/profile')
    }

    const error = () => resetButton()

    formState.submitForm('/api/auth/login', { success, error })
  }

  return (
    <form className={styles.form}>
      <h3 className="heading-tertiary">Login</h3>

      <Input
        label="Email"
        name="email"
        id="login-email"
        type="email"
        formState={formState}
        required
      />

      <Input
        label="Password"
        name="password"
        id="login-password"
        type="password"
        formState={formState}
        required
      />

      <p className={styles.validation}>
        {formState.values.validation}
      </p>

      <div className={styles.bottom}>
        <div className={styles.submit}>
          <Button onClick={handleSubmit}>Login</Button>
        </div>

        <Modal
          buttonClasses={styles.link}
          buttonText="Forgot Password?"
        >
          <ForgotPasswordForm email={formState.values.email} />
        </Modal>
      </div>
    </form>
  )
}

export default LoginForm
