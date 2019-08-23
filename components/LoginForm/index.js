import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../reduxStore'
import Input from '../Input'
import Modal from '../Modal'
import ForgotPasswordForm from './ForgotPasswordForm'

class LoginForm extends Component {

  constructor(props) {

    super(props)

    this.state = { 
      email: '', 
      password: '', 
      validationMessage: ''
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { email, password } = this.state

    axios.post('/api/login', { username: email, password })
      .then(res => {
        axios.get('/api/currentUser')
          .then(res => {
            this.props.setCurrentUser(res.data)
            Router.push('/profile')
          }).catch(err => {
            console.error(err)
          })
      }).catch(err => {
        console.error(err)
        let message = 'Something went wrong. Please try again.'

        if (err.response.data.message) {
          message = err.response.data.message
        }

        this.setState({ validationMessage: message })
      })
  }


  render() {

    const { email, password, validationMessage } = this.state

    return (
      <form className="login-form">

        <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

        <Input
          id="email_login_input"
          label="Email"
          name="username"
          value={email}
          onChange={event => this.setState({ email: event.target.value })}
        />

        <Input
          id="password_login_input"
          label="Password"
          name="password"
          value={password}
          onChange={event => this.setState({ password: event.target.value })}
          type="password"
        />

        <p className="login-form__validation">{validationMessage}</p>

        <div className="login-form__bottom">
          <div className="login-form__submit">
            <button
              className='button button-primary'
              onClick={event => this.handleSubmit(event)}
            >
              Login
            </button>
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
}

export default connect(null, { setCurrentUser })(LoginForm)
