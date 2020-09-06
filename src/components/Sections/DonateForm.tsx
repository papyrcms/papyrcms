import { SectionOptions } from 'types'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import userContext from '@/context/userContext'
import CreditCardForm from '@/components/CreditCardForm'
import Input from '@/components/Input'

const DonateForm: React.FC<{ className?: string }> = (props) => {
  const { currentUser } = useContext(userContext)
  const { className } = props
  const [email, setEmail] = useState(
    currentUser ? currentUser.email : ''
  )
  const [amount, setAmount] = useState(1.0)
  const [paid, setPaid] = useState(false)

  const handleSubmit = (
    source: stripe.Source,
    resetButton: Function,
    setValidation: Function
  ) => {
    switch (true) {
      case amount < 1:
        setValidation('You must donate at least 1 dollar.')
        resetButton()
        return

      case email === '':
        setValidation('Please enter your email.')
        resetButton()
        return

      default:
        const donationData = {
          source,
          amount,
          email,
        }

        axios
          .post('/api/utility/donate', donationData)
          .then((response) => {
            if (response.data.status === 'succeeded') {
              setPaid(true)
            }
          })
          .catch((error) => {
            console.error(error)
            setValidation(
              'Something went wrong. Please try again later.'
            )
            resetButton()
          })
    }
  }

  if (paid) {
    return (
      <div className={`donate-form ${className}`}>
        <div className="donate-form__thanks">
          <h3 className="heading-tertiary">
            Thank you for your donation!
          </h3>
          <p>
            You will recieve a reciept of your donation via the email
            you submitted shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className={`donate-form ${className}`}>
      <form className="donate-form__form">
        <div className="u-form-row">
          <Input
            id="donation_email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(event: any) => setEmail(event.target.value)}
          />

          <Input
            id="donation_amount"
            label="Amount"
            type="number"
            required
            value={amount}
            onChange={(event: any) => setAmount(event.target.value)}
          />
        </div>

        <CreditCardForm onSubmit={handleSubmit} />
      </form>
    </section>
  )
}

export const options: SectionOptions = {
  DonateForm: {
    file: 'DonateForm',
    name: 'Donate Form',
    description:
      'This is a simple donation form where people can donate money to you.',
    inputs: ['className'],
    // maxPosts: null,
    defaultProps: {},
  },
}

export default DonateForm
