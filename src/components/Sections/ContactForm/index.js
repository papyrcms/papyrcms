import React, { useContext } from 'react'
import userContext from '@/context/userContext'
import Input from '@/components/Input'
import useForm from '@/hooks/useForm'
import styles from './style.module.scss'


/**
 * ContactForm is the main contact form component
 */
const ContactForm = (props) => {

  const { className } = props
  const { currentUser } = useContext(userContext)

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

  const {
    values,
    handleChange,
    errors,
    validateField,
    submitForm
  } = useForm({ name, email, message: '', validation: '' })


  const handleSubmit = (event) => {
    event.preventDefault()

    const success = (response, setValidation) => {
      setValidation('Thanks for reaching out! I\'ll be in touch.')
    }

    submitForm('/api/messages', { success })
  }


  return (
    <section className={`${className} ${styles['contact-form']}`}>

      <form className={styles["contact-form__form"]} onSubmit={handleSubmit}>

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

        <div className={styles["contact-form__field--textarea"]}>
          <label htmlFor="contact-message" className={styles["contact-form__label"]}>Message</label>
          <textarea
            id="contact-message"
            className={styles["contact-form__textarea"]}
            name="message"
            value={values.message}
            onBlur={validateField}
            onChange={handleChange}
            required
          />
          <p className={styles["contact-form__validation"]}>{errors.message}</p>
        </div>

        <input
          type="submit"
          className={[`button button-primary ${styles["contact-form__submit"]}`]}
          value="Send"
        />

        <p className={styles["contact-form__validation"]}>{values.validation}</p>

      </form>
    </section>
  )
}


export const options = {
  ContactForm: {
    file: 'ContactForm',
    name: 'Contact Form',
    description: 'This is a simple contact form where people can leave their name, email, and a message for you. It is not content-based.',
    inputs: ['className'],
    maxPosts: null,
    defaultProps: {}
  }
}


export default ContactForm
