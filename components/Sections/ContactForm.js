import React from 'react'
import { connect } from 'react-redux'
import Input from '../Input'
import useForm from '../../hooks/useForm'


/**
 * ContactForm is the main contact form component
 *
 * @prop initialMessage - String - a suggested message to initially be displayed in the textarea
 */
const ContactForm = props => {

  const { currentUser, initialMessage, className } = props

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


  const handleSubmit = event => {

    const success = (response, setValidation) => {
      setValidation('Thanks for reaching out! I\'ll be in touch.')
    }

    submitForm(event, '/api/contact', { success })
  }


  return (
    <section className={`${className} contact-form`}>

      <form className="contact-form__form" onSubmit={handleSubmit}>

        <div className="contact-form__top">
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
          <label htmlFor="contact-message" className="contact-form__label">Message</label>
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

        <input
          type="submit"
          className="button button-primary contact-form__submit"
          value="Send"
        />

        <p className="contact-form__validation">{values.validation}</p>

      </form>
    </section>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(ContactForm)
