import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import CreditCardForm from '../CreditCardForm'
import Input from '../Input'


class DonateForm extends Component {

  constructor(props) {

    super(props)

    this.state = {
      email: props.currentUser ? props.currentUser.email : '',
      amount: 1.00,
      paid: false,
    }
  }


  async handleSubmit(stripeSource, setProcessing, setValidation) {

    const { amount, email } = this.state

    switch (true) {

      case amount < 1:
        setValidation('You must donate at least 1 dollar.')
        setProcessing(false)
        return

      case email === '':
        setValidation('Please enter your email.')
        setProcessing(false)
        return

      default:
        const donationData = {
          ...stripeSource,
          amount,
          email,
        }

        await axios.post('/api/donate', donationData)
          .then(response => {
            if (response.data.status === 'succeeded') {
              this.setState({ paid: true })
            }
          })
          .catch(error => {
            console.error(error)
            setValidation('Something went wrong. Please try again later.')
            setProcessing(false)
          })
    }
  }


  render() {

    const { amount, email, paid } = this.state

    if (paid) {
      return (
        <div className="donate-form">
          <div className="donate-form__thanks">
            <h3 className="heading-tertiary">Thank you for your donation!</h3>
            <p>You will recieve a reciept of your donation via the email you submitted shortly.</p>
          </div>
        </div>
      )
    }

    return (
      <form className="donate-form">
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

          <CreditCardForm
            onSubmit={this.handleSubmit.bind(this)}
          />
        </div>
      </form>
    )
  }
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(DonateForm)
