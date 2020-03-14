import React, { useContext } from 'react'
import Router from 'next/router'
import userContext from '../../context/userContext'
import useForm from '../../hooks/useForm'
import Input from '../Input'
import Modal from '../Modal'
import ForgotPasswordForm from './ForgotPasswordForm'


const LoginForm = () => {

  const { setCurrentUser } = useContext(userContext)
  const INITIAL_STATE = {
    username: '',
    password: '',
    validation: ''
  }
  const formState = useForm(INITIAL_STATE)


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const success = (res: any) => {
      localStorage.setItem('token', res.data.token)
      setCurrentUser(res.data.user)
      Router.push('/profile')
    }

    formState.submitForm('/api/auth/login', { success })
  }


  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

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

      <p className="login-form__validation">{formState.values.validation}</p>

      <div className="login-form__bottom">
        <div className="login-form__submit">
          <input
            type="submit"
            className='button button-primary'
            value="Login"
          />
        </div>

        <Modal
          buttonClasses="login-form__forgot-password"
          buttonText="Forgot Password?"
        >
          <ForgotPasswordForm email={formState.values.email} />
        </Modal>
      </div>

    </form>
  )
}

export default LoginForm
