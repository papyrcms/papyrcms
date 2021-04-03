import React, { useState, useEffect, useContext } from 'react'
import {
  StripeProvider,
  Elements,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe,
} from 'react-stripe-elements'
import { keysContext } from '@/context'
import Button from '../Button'
import styles from './CreditCardForm.module.scss'

type CCFProps = {
  className?: string
  stripe?: stripe.Stripe
  onSubmit: Function
}

const CreditCardForm = injectStripe((props: CCFProps) => {
  const { className = '', stripe, onSubmit } = props
  const [validation, setValidation] = useState('')

  if (!stripe) return null

  const handleSubmit = async (event: any, resetButton: Function) => {
    event.preventDefault()

    const data = await stripe.createSource({ type: 'card' })

    if (data.error) {
      setValidation(data.error.message || '')
      resetButton()
      return
    }

    onSubmit(data.source, resetButton, setValidation)
  }

  const fieldStyle = {
    base: {
      color: '#333',
      fontSize: '18',
      lineHeight: '1',
      letterSpacing: '1',
    },
  }

  return (
    <div className={`${styles.form} ${className || ''}`}>
      <div className={`${styles.section} ${styles.number}`}>
        <label className={styles.label}>Card Number *</label>
        <div className={styles.input}>
          <CardNumberElement style={fieldStyle} />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Card Expiration *</label>
        <div className={styles.input}>
          <CardExpiryElement style={fieldStyle} />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Card CVC *</label>
        <div className={styles.input}>
          <CardCVCElement style={fieldStyle} />
        </div>
      </div>

      <p className={styles.validation}>{validation}</p>

      <Button
        className={styles.submit}
        onClick={handleSubmit}
        submittedText="Processing"
      >
        Submit
      </Button>
    </div>
  )
})

type FormProps = {
  className?: string
  onSubmit: Function
}

const StripeForm = (props: FormProps) => {
  const { className, onSubmit } = props
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null)
  const { keys } = useContext(keysContext)

  useEffect(() => {
    const stripeInstance = window.Stripe(keys.stripePublishableKey)
    setStripe(stripeInstance)
  }, [])

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CreditCardForm className={className} onSubmit={onSubmit} />
      </Elements>
    </StripeProvider>
  )
}

export default StripeForm
