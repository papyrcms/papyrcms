import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Router from 'next/router'
import jwt from 'jsonwebtoken'
import Input from '../components/Input'


class ForgotPasswordPage extends Component {

  constructor(props) {
    super(props)

    this.state = { password: '', confirmPassword: '', validation: '' }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { password, confirmPassword } = this.state

    const params = {
      password,
      confirmPassword,
      token: this.props.url.query.token
    }

    axios.post('/api/changeForgottenPassword', params)
      .then(response => {
        this.setState({ validation: response.data.message })
        Router.push('/login')
      })
      .catch(error => {
        console.log(error)
        this.setState({ validation: error.response.data.message })
      })
  }


  render() {

    const { password, confirmPassword, validation } = this.state
    const data = jwt.decode(this.props.url.query.token)

    return (
      <div className="forgot-password-page">
        <h3 className="heading-tertiary u-margin-bottom-small forgot-password-page__title">Reset Password for {data.email}</h3>

        <form 
          onSubmit={event => this.handleSubmit(event)}
          className="forgot-password-page__form"
        >
          <Input
            id="password"
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={event => this.setState({ password: event.target.value })}
          />

          <Input
            id="confirm_password"
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={event => this.setState({ confirmPassword: event.target.value })}
          />

          <p className="forgot-password-page__validation">{validation}</p>

          <button
            className="button button-primary"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return { url: state.url }
}


export default connect(mapStateToProps)(ForgotPasswordPage)