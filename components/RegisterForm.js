import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { connect } from 'react-redux'
import { setCurrentUser } from '../reduxStore'
import Input from './Input'

class RegisterForm extends Component {

  constructor(props) {

    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      validationMessage: ''
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { firstName, lastName, email, password, passwordConfirm } = this.state
    let message = ''

    axios.post('/api/register', { firstName, lastName, username: email, password, passwordConfirm })
      .then(res => {
        if (res.data.error) {
          message = res.data.error.message

          this.setState({ validationMessage: message })
        } else if (res.data === 'success') {
          axios.get('/api/currentUser')
            .then(res => {
              this.props.setCurrentUser(res.data)
              Router.push('/profile')
            }).catch(err => {
              message = err.response.data.message

              this.setState({ validationMessage: message })
            })
        }
      }).catch(err => {
        message = err.response.data.message

        this.setState({ validationMessage: message })
      })
  }


  renderForm() {

    const { firstName, lastName, email, password, passwordConfirm, validationMessage } = this.state

    if (this.props.settings.enableRegistration) {
      return (
        <form onSubmit={this.handleSubmit.bind(this)} className="register-form">
          <h3 className="heading-tertiary u-margin-bottom-small">Register</h3>

          <Input
            id="first_name_register_input"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={event => this.setState({ firstName: event.target.value })}
          />

          <Input
            id="last_name_register_input"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={event => this.setState({ lastName: event.target.value })}
          />

          <Input
            id="email_register_input"
            label="Email"
            name="email"
            value={email}
            onChange={event => this.setState({ email: event.target.value })}
          />

          <Input
            id="password_register_input"
            label="Password"
            name="password"
            value={password}
            onChange={event => this.setState({ password: event.target.value })}
            type="password"
          />

          <Input
            id="password_confirm_register_input"
            label="Confirm Password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={event => this.setState({ passwordConfirm: event.target.value })}
            type="password"
          />

          <p className="register-form__validation">{validationMessage}</p>

          <div className="register-form__submit">
            <input
              type='submit'
              value='Register'
              className='button button-primary'
            />
          </div>
        </form>
      )
    } else {
      return null
    }
  }


  render() {

    return this.renderForm()
  }
}


const mapStateToProps = state => {
  return { settings: state.settings }
}


export default connect(mapStateToProps, { setCurrentUser })(RegisterForm)
