import React from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

export default () => {
  return (
    <div className="login-page">
      <LoginForm className="login-page__form" />
      <RegisterForm className="login-page__form" />
    </div>
  )
}
