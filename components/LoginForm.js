import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'
import Input from './Input'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = { email: '', password: '', validationMessage: '' }
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
          onChange={event => this.setState({ email: event.target.table })}
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

        <div className="login-form__submit">
          <input
            type='submit'
            value='Login'
            className='button button-primary'
          />
        </div>

      </form>
    )
  }
}

export default connect(null, { setCurrentUser })(LoginForm)
