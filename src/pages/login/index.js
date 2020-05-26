import React from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import styles from './login.module.scss'

export default () => (
  <div className={styles["login-page"]}>
    <LoginForm />
    <RegisterForm />
  </div>
)
