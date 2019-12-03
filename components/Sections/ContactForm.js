import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Input from '../Input'


/**
 * ContactForm is the main contact form component
 *
 * @prop initialMessage - String - a suggested message to initially be displayed in the textarea
 */
class ContactForm extends Component {

  constructor(props) {

    super(props)

    let contactName = ''
    let contactEmail = ''

    if (props.currentUser) {
      const { firstName, lastName, email } = props.currentUser

      if (firstName && !lastName) {
        contactName = firstName
      } else if (!firstName && lastName) {
        contactName = lastName
      } else if (firstName && lastName) {
        contactName = `${firstName} ${lastName}`
      }

      contactEmail = email ? email : ''
    }

    this.state = {
      contactName,
      contactEmail,
      contactMessage: props.initialMessage || '',
      formValidation: ''
    }
  }


  handleSubmit(event) {

    event.preventDefault()

    const { contactName, contactEmail, contactMessage } = this.state
    const contactObject = { contactName, contactEmail, contactMessage }
    let message = ''

    if (
      contactName === '' ||
      contactEmail === '' ||
      contactMessage === ''
    ) {
      message = 'Please complete all the fields.'

      this.setState({ formValidation: message })
    } else {

      axios.post('/api/contact', contactObject)
        .then(response => {
          this.setState({
            contactName: '',
            contactEmail: '',
            contactMessage: '',
            formValidation: 'Thanks for reaching out! I\'ll be in touch.'
          })
        }).catch(error => {
          console.error(error)
        })
    }
  }


  render() {

    const { contactName, contactEmail, contactMessage, formValidation } = this.state
    const { className } = this.props

    return (
      <section className={`${className} contact-form`}>

        <form className="contact-form__form" onSubmit={this.handleSubmit.bind(this)}>

          <div className="contact-form__top">
            <Input
              id="contact-name"
              label="Name"
              name="name"
              value={contactName}
              onChange={event => this.setState({ contactName: event.target.value })}
            />

            <Input
              id="contact-email"
              label="Email"
              name="email"
              value={contactEmail}
              onChange={event => this.setState({ contactEmail: event.target.value })}
            />
          </div>

          <div className="contact-form__field--textarea">
            <label htmlFor="contact-message" className="contact-form__label">Message</label>
            <textarea
              id="contact-message"
              className="contact-form__textarea"
              value={contactMessage}
              onChange={event => this.setState({ contactMessage: event.target.value })}
            />
          </div>

          <input
            type="submit"
            className="button button-primary contact-form__submit"
          />

          <p className="contact-form__validation">{formValidation}</p>

        </form>
      </section>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(ContactForm)
