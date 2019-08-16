import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { injectStripe } from 'react-stripe-elements'
import { SectionStandard } from '../components/Sections/'
import CreditCardForm from './CreditCardForm'
import Input from './Input'


class DonateForm extends Component {

  constructor(props) {

    super(props)

    this.state = {
      email: props.currentUser ? props.currentUser.email : '',
      amount: 1.00,
      processing: false,
      paid: false,
      validation: ''
    }
  }


  async handleSubmit(event) {

    event.preventDefault()

    this.setState({ processing: true })

    const { amount, email } = this.state
    const data = await this.props.stripe.createSource({ type: 'card' })
    let message = ''

    switch (true) {
      case !!data.error:
        message = data.error.message
        return this.setState({ processing: false, validation: message })

      case amount < 1:
        message = 'You must donate at least 1 dollar.'
        return this.setState({ processing: false, validation: message })

      case email === '':
        message = 'Please enter your email.'
        return this.setState({ processing: false, validation: message })

      default:

        const donationData = {
          ...data.source,
          amount,
          email,
        }

        axios.post('/api/donate', donationData)
          .then(response => {
            if (response.data.status === 'succeeded') {
              this.setState({ paid: true })
            }
          })
          .catch(error => {
            console.error(error)
            message = 'Something went wrong. Please try again later.'
            this.setState({ processing: false, validation: message })
          })
    }
  }


  render() {

    const { amount, email, processing, paid, validation } = this.state
    const { title, posts } = this.props

    if (!paid) {
      return (
        <form className="donate-form" onSubmit={this.handleSubmit.bind(this)}>

          <SectionStandard
            title={title}
            posts={posts}
            className="u-padding-bottom-small"
          />

          <div className="donate-form__container">

            <div className="donate-form__form">

              <div className="donate-form__form--top u-margin-bottom-small">
                <Input
                  id="donation_email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={event => this.setState({ email: event.target.value })}
                />

                <Input
                  id="donation_amount"
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={event => this.setState({ amount: event.target.value })}
                />
              </div>

              <CreditCardForm className="u-margin-bottom-small" />

              <p className="donate-form__validation">{validation}</p>

              <input
                type="submit"
                className="button button-primary donate-form__submit"
                value={processing ? 'Processing' : 'Submit'}
                disabled={processing ? true : false}
              />

            </div>

          </div>

        </form>
      )
    } else {
      return (
        <div className="donate-form">
          <div className="donate-form__thanks">
            <h3 className="heading-tertiary">Thank you for your donation!</h3>
            <p>You will recieve a reciept of your donation via the email you submitted shortly.</p>
          </div>
        </div>
      )
    }
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default injectStripe(connect(mapStateToProps)(DonateForm))
