import React, { useContext } from 'react'
import { useUser } from '@/context'
import { Input, Button } from '@/components'
import { useForm } from '@/hooks'
import styles from './ContactForm.module.scss'
import { Post } from '@/types'

type Props = {
  className?: string
  post?: Post
}

/**
 * ContactForm is the main contact form component
 */
const ContactForm: React.FC<Props> = (props) => {
  const { className, post } = props
  const { currentUser } = useUser()

  let name = ''
  let email = ''
  if (currentUser) {
    const { firstName, lastName } = currentUser

    if (firstName && !lastName) {
      name = firstName
    } else if (!firstName && lastName) {
      name = lastName
    } else if (firstName && lastName) {
      name = `${firstName} ${lastName}`
    }

    email = currentUser.email ? currentUser.email : ''
  }

  let message = ''
  if (post?.content) {
    message = post.content.replace('<p>', '').replace('</p>', '')
  }

  const { values, handleChange, errors, validateField, submitForm } =
    useForm({
      name,
      email,
      message,
      validation: '',
    })

  const handleSubmit = (event: any, resetButton: Function) => {
    event.preventDefault()

    const success = (response: any, setValidation: Function) => {
      setValidation("Thanks for reaching out! I'll be in touch.")
      resetButton()
    }

    const error = () => resetButton()

    submitForm('/api/messages', { success, error })
  }

  return (
    <section className={`${className || ''} ${styles.section}`}>
      <form className={styles.form}>
        <div className="u-form-row">
          <Input
            id="contact-name"
            label="Name"
            name="name"
            value={values.name}
            validation={errors.name}
            onChange={handleChange}
            onBlur={validateField}
            required
          />

          <Input
            id="contact-email"
            label="Email"
            name="email"
            type="email"
            value={values.email}
            validation={errors.email}
            onChange={handleChange}
            onBlur={validateField}
            required
          />
        </div>

        <Input
          name="message"
          value={values.message}
          validation={errors.message}
          onBlur={validateField}
          onChange={handleChange}
          required
          id="contact-message"
          label="Message"
          type="textarea"
        />

        <Button onClick={handleSubmit} className={styles.submit}>
          Send
        </Button>

        <p className={styles.validation}>{values.validation}</p>
      </form>
    </section>
  )
}

export default ContactForm
