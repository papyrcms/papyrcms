import { useState, useEffect } from 'react'
import axios from 'axios'
import Input from '../../Input'
import Button from '../../Button'
import styles from './ForgotPasswordForm.module.scss'

const ForgotPasswordForm: React.FC<{ email?: string }> = (props) => {
  const [email, setEmail] = useState(props.email || '')
  const [validation, setValidation] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!editing && props.email && email !== props.email) {
      setEmail(props.email)
    }
  })

  const handleSubmit = (event: any, resetButton: Function) => {
    event.preventDefault()

    // Send password reset email
    axios
      .post('/api/auth/forgotPassword', { email })
      .then((response) => {
        setValidation(response.data.message)
        resetButton()
      })
      .catch((error) => {
        console.error(error)
        setValidation(error.response.data.message)
        resetButton()
      })
  }

  return (
    <div className={styles.container}>
      <h3 className="heading-tertiary forgot-password__title">
        Forgot your password?
      </h3>

      <p>
        Nothing to worry about! Just enter your email in the field
        below, and we'll send you a link so you can reset it.
      </p>

      <Input
        className={styles.input}
        id="email_forgot_password"
        label="Email"
        name="email"
        value={email}
        onChange={(event: any) => setEmail(event.target.value)}
        onFocus={() => {
          if (!editing) setEditing(true)
        }}
        onBlur={() => {
          if (editing) setEditing(false)
        }}
      />

      <p className={styles.validation}>{validation}</p>

      <Button className={styles.submit} onClick={handleSubmit}>
        Send
      </Button>
    </div>
  )
}

export default ForgotPasswordForm
