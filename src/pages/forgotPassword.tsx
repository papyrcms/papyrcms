import React, { useState } from 'react'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import Input from '../components/Input'


const ForgotPasswordPage = () => {

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validation, setValidation] = useState('')
  const { query } = useRouter()
  const { token } = query
  if (typeof token !== 'string') return null


  const handleSubmit = (event: React.FormEvent) => {

    event.preventDefault()

    const params = {
      password,
      confirmPassword,
      token
    }

    axios.post('/api/auth/requestPasswordChange', params)
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
  if (!data) return null

  // @ts-ignore email is decoded from the token
  const { email } = data

  return (
    <div className="forgot-password-page">
      <h3 className="heading-tertiary u-margin-bottom-small forgot-password-page__title">Reset Password for {email}</h3>

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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
        />

        <Input
          id="confirm_password"
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
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


export default ForgotPasswordPage
