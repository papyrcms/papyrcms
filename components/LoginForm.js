import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'

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
      <form onSubmit={this.handleSubmit.bind(this)} className={this.props.className}>

        <h3 className="heading-tertiary u-margin-bottom-small">Login</h3>

        <label className="login-page__label" htmlFor='email_login_input'>Email</label>
        <input
          type='text'
          name='username'
          id='email_login_input'
          className="login-page__input"
          value={email}
          onChange={event => this.setState({ email: event.target.value })}
        />

        <label className="login-page__label" htmlFor='password_login_input'>Password</label>
        <input
          type='password'
          name='password'
          id='password_login_input'
          className="login-page__input"
          value={password}
          onChange={event => this.setState({ password: event.target.value })}
        />

        <p className="login-page__validation">{validationMessage}</p>

        <div className="login-page__submit">
          <input
            type='submit'
            value='Login'
            className='button button-secondary'
          />
        </div>

      </form>
    )
  }
}

export default connect(null, { setCurrentUser })(LoginForm)
