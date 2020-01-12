import React from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../../reduxStore'
import useForm from '../../hooks/useForm'
import Input from '../Input'
import Modal from '../Modal'
import ForgotPasswordForm from './ForgotPasswordForm'


const LoginForm = props => {

  const { setCurrentUser } = props
  const INITIAL_STATE = {
    username: '',
    password: '',
    validation: ''
  }
  const formState = useForm(INITIAL_STATE)


  const handleSubmit = event => {
    event.preventDefault()

    const success = () => {
      axios.get('/api/auth/currentUser')
        .then(res => {
          setCurrentUser(res.data)
          Router.push('/profile')
        }).catch(err => {
          console.error(err)
        })
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

export default connect(null, { setCurrentUser })(LoginForm)
