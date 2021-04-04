import React, { useState, useContext } from 'react'
import axios from 'axios'
import { userContext } from '@/context'
import { CreditCardForm, Input } from '@/components'
import styles from './DonateForm.module.scss'

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
      <div className={`${styles.container} ${className}`}>
        <div className={styles.thanks}>
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
    <section className={`${styles.container} ${className}`}>
      <form className={styles.form}>
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

export default DonateForm
