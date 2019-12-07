import React, { useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../reduxStore'
import Input from '../Input'
import Modal from '../Modal'
import ForgotPasswordForm from './ForgotPasswordForm'


const LoginForm = props => {

  const { setCurrentUser } = props
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validation, setValidation] = useState('')


  const handleSubmit = event => {

    event.preventDefault()

    axios.post('/api/login', { username: email, password })
      .then(res => {

        axios.get('/api/currentUser')
          .then(res => {
            setCurrentUser(res.data)
            Router.push('/profile')
          }).catch(err => {
            console.error(err)
          })
      }).catch(err => {

        console.error(err)

        if (err.response.data.message) {
          setValidation(err.response.data.message)
        } else {
          setValidation('Something went wrong. Please try again.')
        }
      })
  }


  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

      <Input
        id="email_login_input"
        label="Email"
        name="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
      />

      <Input
        id="password_login_input"
        label="Password"
        name="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        type="password"
      />

      <p className="login-form__validation">{validation}</p>

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
          <ForgotPasswordForm email={email} />
        </Modal>
      </div>

    </form>
  )
}

export default connect(null, { setCurrentUser })(LoginForm)
