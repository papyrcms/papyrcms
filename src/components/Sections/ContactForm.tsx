import { SectionOptions } from 'types'
import React, { useContext } from 'react'
import userContext from '@/context/userContext'
import Input from '@/components/Input'
import Button from '@/components/Button'
import useForm from '@/hooks/useForm'

/**
 * ContactForm is the main contact form component
 */
const ContactForm: React.FC<{ className?: string }> = (props) => {
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
    submitForm,
  } = useForm({ name, email, message: '', validation: '' })

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
    <section className={`${className} contact-form`}>
      <form className="contact-form__form">
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

        <div className="contact-form__field--textarea">
          <label
            htmlFor="contact-message"
            className="contact-form__label"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            className="contact-form__textarea"
            name="message"
            value={values.message}
            onBlur={validateField}
            onChange={handleChange}
            required
          />
          <p className="contact-form__validation">{errors.message}</p>
        </div>

        <Button
          onClick={handleSubmit}
          className="contact-form__submit"
          submittedText="Sending"
        >
          Send
        </Button>

        <p className="contact-form__validation">
          {values.validation}
        </p>
      </form>
    </section>
  )
}

export const options: SectionOptions = {
  ContactForm: {
    file: 'ContactForm',
    name: 'Contact Form',
    description:
      'This is a simple contact form where people can leave their name, email, and a message for you. It is not content-based.',
    inputs: ['className'],
    // maxPosts: null,
    defaultProps: {},
  },
}

export default ContactForm
