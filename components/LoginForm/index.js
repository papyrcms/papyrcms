import React from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../reduxStore'
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

    submitForm(event, '/api/login', { success })
  }


  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

      <Input
        id="email_login_input"
        label="Email"
        name="username"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={validateField}
        required
        validation={errors.email}
      />

      <Input
        id="password_login_input"
        label="Password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={validateField}
        required
        validation={errors.password}
        type="password"
      />

      <p className="login-form__validation">{values.validation}</p>

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
          <ForgotPasswordForm email={values.email} />
        </Modal>
      </div>

    </form>
  )
}

export default connect(null, { setCurrentUser })(LoginForm)
