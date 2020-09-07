import React from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import styles from './login.module.scss'

const LoginPage = () => (
  <div className={styles.main}>
    <LoginForm />
    <RegisterForm />
  </div>
)

export default LoginPage
