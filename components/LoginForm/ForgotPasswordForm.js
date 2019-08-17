import React, { Component } from 'react'
import axios from 'axios'
import Input from '../Input'


class ForgotPasswordForm extends Component {

  constructor(props) {

    super(props)

    this.state = {
      email: props.email ? props.email : '',
      validation: '',
      editing: false
    }
  }


  componentDidUpdate() {

    const { email } = this.props

    if (!this.state.editing && email && email !== this.state.email) {
      this.setState({ email })
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const params = {
      email: this.state.email
    }

    // Send password reset email
    axios.post('/api/forgotPassword', params)
      .then(response => {
        this.setState({ validation: response.data.message })
      })
      .catch(error => {
        console.error(error)
        this.setState({ validation: error.response.data.message })
      })
  }


  render() {

    const { email, validation, editing } = this.state

    return (

      <div className="forgot-password">
        <h3 className="heading-tertiary forgot-password__title">Forgot your password?</h3>

        <p className="forgot-password__content">Nothing to worry about! Just enter your email in the field below, and we'll send you a link so you can reset it.</p>

        <Input
          className="forgot-password__input"
          id="email_forgot_password"
          label="Email"
          name="email"
          value={email}
          onChange={event => this.setState({ email: event.target.value })}
          onFocus={() => { if (!editing) { this.setState({ editing: true }) } }}
          onBlur={() => { if (editing) { this.setState({ editing: false }) } }}
        />

        <p className="forgot-password__validation">{validation}</p>

        <button
          className="button button-primary forgot-password__submit"
          onClick={event => this.handleSubmit(event)}
        >
          Send
        </button>
      </div>
    )
  }
}


export default ForgotPasswordForm
