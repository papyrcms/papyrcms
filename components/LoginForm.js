import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'
import Input from './Input'
import Modal from './Modal'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = { 
      email: '', 
      forgotPasswordEmail: '',
      forgotPasswordValidation: '',
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
        const message = 'Something went wrong. Please try again.'

        this.setState({ validationMessage: message })
      })
  }


  handleForgotPasswordSubmit(event) {

    event.preventDefault()

    const params = {
      email: this.state.forgotPasswordEmail
    }

    // Send password reset email
    axios.post('/api/forgotPassword', params)
      .then(response => {
        this.setState({ forgotPasswordValidation: response.data })
      })
      .catch(error => console.error(error))
  }


  renderForgotPassword() {

    const { forgotPasswordEmail, forgotPasswordValidation } = this.state

    return (
      <div className="forgot-password">
        <h3 className="heading-tertiary forgot-password__title">Forgot your password?</h3>

        <p className="forgot-password__content">Nothing to worry about! Just enter your email in the field below, and we'll send you a link so you can reset it.</p>

        <Input
          className="forgot-password__input"
          id="email_forgot_password"
          label="Email"
          name="email"
          value={forgotPasswordEmail}
          onChange = {event => this.setState({forgotPasswordEmail: event.target.value })}
        />

        <p className="forgot-password__validation">{forgotPasswordValidation}</p>

        <button
          className="button button-primary forgot-password__submit"
          onClick={event => this.handleForgotPasswordSubmit(event)}
        >
          Send
        </button>
      </div>
    )
  }


  render() {

    const { email, password, validationMessage } = this.state

    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="login-form">

        <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

        <Input
          id="email_login_input"
          label="Email"
          name="username"
          value={email}
          onChange={event => {
            this.setState({ email: event.target.value })
            this.setState({ forgotPasswordEmail: event.target.value })
          }}
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
          <Modal
            buttonClasses="login-form__forgot-password"
            buttonText="Forgot Password?"
          >
            {this.renderForgotPassword()}
          </Modal>

          <div className="login-form__submit">
            <input
              type='submit'
              value='Login'
              className='button button-primary'
            />
          </div>
        </div>

      </form>
    )
  }
}

export default connect(null, { setCurrentUser })(LoginForm)
