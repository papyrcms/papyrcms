import React, { useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import CreditCardForm from '../CreditCardForm'
import Input from '../Input'


const DonateForm = props => {


  const { currentUser, className } = props
  const [email, setEmail] = useState(currentUser ? currentUser.email : '')
  const [amount, setAmount] = useState(1.00)
  const [paid, setPaid] = useState(false)


  const handleSubmit = (stripeSource, setProcessing, setValidation) => {

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

        axios.post('/api/donate', donationData)
          .then(response => {
            if (response.data.status === 'succeeded') {
              setPaid(true)
            }
          })
          .catch(error => {
            console.error(error)
            setValidation('Something went wrong. Please try again later.')
            setProcessing(false)
          })
    }
  }

  if (paid) {
    return (
      <div className={`donate-form ${className}`}>
        <div className="donate-form__thanks">
          <h3 className="heading-tertiary">Thank you for your donation!</h3>
          <p>You will recieve a reciept of your donation via the email you submitted shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <section className={`donate-form ${className}`}>
      <form className="donate-form__form">
        <div className="donate-form__form--top u-margin-bottom-small">
          <Input
            id="donation_email"
            label="Email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <Input
            id="donation_amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={event => setAmount(event.target.value)}
          />
        </div>

        <CreditCardForm onSubmit={handleSubmit} />
      </form>
    </section>
  )
}


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default connect(mapStateToProps)(DonateForm)
