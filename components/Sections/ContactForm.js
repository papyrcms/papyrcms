import React, { useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Input from '../Input'


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

  const [contactName, setContactName] = useState(name)
  const [contactEmail, setContactEmail] = useState(email)
  const [contactMessage, setContactMessage] = useState(initialMessage || '')
  const [validation, setValidation] = useState('')


  const handleSubmit = event => {

    event.preventDefault()

    if (
      contactName === '' ||
      contactEmail === '' ||
      contactMessage === ''
    ) {
      setValidation('Please complete all the fields.')
    } else {

      const contactObject = { contactName, contactEmail, contactMessage }

      axios.post('/api/contact', contactObject)
        .then(response => {
          setContactName('')
          setContactEmail('')
          setContactMessage('')
          setValidation('Thanks for reaching out! I\'ll be in touch.')
        }).catch(error => {
          console.error(error)
        })
    }
  }


  return (
    <section className={`${className} contact-form`}>

      <form className="contact-form__form" onSubmit={handleSubmit}>

        <div className="contact-form__top">
          <Input
            id="contact-name"
            label="Name"
            name="name"
            value={contactName}
            onChange={event => setContactName(event.target.value)}
          />

          <Input
            id="contact-email"
            label="Email"
            name="email"
            value={contactEmail}
            onChange={event => setContactEmail(event.target.value)}
          />
        </div>

        <div className="contact-form__field--textarea">
          <label htmlFor="contact-message" className="contact-form__label">Message</label>
          <textarea
            id="contact-message"
            className="contact-form__textarea"
            value={contactMessage}
            onChange={event => setContactMessage(event.target.value)}
          />
        </div>

        <input
          type="submit"
          className="button button-primary contact-form__submit"
          value="Send"
        />

        <p className="contact-form__validation">{validation}</p>

      </form>
    </section>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(ContactForm)
