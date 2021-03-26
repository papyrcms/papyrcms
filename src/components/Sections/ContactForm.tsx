import { SectionOptions } from 'types'
import React, { useContext } from 'react'
import { userContext } from '@/context'
import { Input, Button } from '@/components'
import { useForm } from '@/hooks'

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
    component: 'ContactForm',
    name: 'Contact Form',
    description:
      'This is a simple contact form where people can leave their name, email, and a message for you. It is not content-based.',
    inputs: ['className'],
    // maxPosts: null,
    defaultProps: {},
  },
}

export default ContactForm
