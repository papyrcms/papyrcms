import React, { useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Router from 'next/router'
import jwt from 'jsonwebtoken'
import Input from '../components/Input'


const ForgotPasswordPage = props => {

  const { token } = props.url.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validation, setValidation] = useState('')


  const handleSubmit = event => {

    event.preventDefault()

    const params = {
      password,
      confirmPassword,
      token
    }

    axios.post('/api/changeForgottenPassword', params)
      .then(response => {
        setValidation(response.data.message)
        Router.push('/login')
      })
      .catch(error => {
        console.error(error)
        setValidation(error.response.data.message)
      })
  }


  const data = jwt.decode(token)

  return (
    <div className="forgot-password-page">
      <h3 className="heading-tertiary u-margin-bottom-small forgot-password-page__title">Reset Password for {data.email}</h3>

      <form
        onSubmit={handleSubmit}
        className="forgot-password-page__form"
      >
        <Input
          id="password"
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <Input
          id="confirm_password"
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
        />

        <p className="forgot-password-page__validation">{validation}</p>

        <input
          className="button button-primary"
          type="submit"
        />
      </form>
    </div>
  )
}


const mapStateToProps = state => {
  return { url: state.url }
}


export default connect(mapStateToProps)(ForgotPasswordPage)