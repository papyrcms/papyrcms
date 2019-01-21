import React, { Component } from 'react'
import axios from 'axios'

class ContactForm extends Component {

  constructor( props ) {

    super( props )

    this.state = {
      contactName: '',
      contactEmail: '',
      contactMessage: '',
      formValidation: ''
    }
  }


  handleSubmit( event ) {

    event.preventDefault()

    const { contactName, contactEmail, contactMessage } = this.state
    const contactObject = { contactName, contactEmail, contactMessage }
    let message = ''

    if (
      contactName === '' ||
      contactEmail === '' ||
      contactMessage === ''
    ) {
      message = 'Please complete all the fields'

      this.setState({ formValidation: message })
    } else {

      axios.post( '/api/contact', contactObject )
        .then( response => {
          this.setState({
            contactName: '',
            contactEmail: '',
            contactMessage: '',
            formValidation: 'Thanks for reaching out! I\'ll be in touch.'
          })
        }).catch( error => {
          console.error( error )
        })
    }
  }

  
  render() {

    const { contactName, contactEmail, contactMessage, formValidation } = this.state

    return (
      <div className="contact-form">
        <h2 className="heading-secondary contact-form__header">Contact</h2>

        <form className="contact-form__form" onSubmit={ this.handleSubmit.bind( this ) }>

          <div className="contact-form__field">
            <label htmlFor="contact-name" className="contact-form__label">Name</label>
            <input
              id="contact-name"
              className="contact-form__input"
              type="text"
              value={ contactName }
              onChange={ event => this.setState({ contactName: event.target.value }) }
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-email" className="contact-form__label">Email</label>
            <input
              id="contact-email"
              className="contact-form__input"
              type="text"
              value={ contactEmail }
              onChange={ event => this.setState({ contactEmail: event.target.value }) }
            />
          </div>

          <div className="contact-form__field contact-form__field--textarea">
            <label htmlFor="contact-message" className="contact-form__label">Message</label>
            <textarea
              id="contact-message"
              className="contact-form__textarea"
              value={ contactMessage }
              onChange={ event => this.setState({ contactMessage: event.target.value }) }
            />
          </div>

          <input
            type="submit"
            className="button button-primary contact-form__submit"
          />

          <p className="contact-form__validation">{ formValidation }</p>

        </form>
      </div>
    )
  }
}


export default ContactForm
