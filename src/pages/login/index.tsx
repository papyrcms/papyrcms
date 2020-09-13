import React from 'react'
import { LoginForm, RegisterForm } from '@/components'
import styles from './login.module.scss'

const LoginPage = () => (
  <div className={styles.main}>
    <LoginForm />
    <RegisterForm />
  </div>
)

export default LoginPage
