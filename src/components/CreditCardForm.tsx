import React, { useState, useEffect, useContext } from 'react'
import {
  StripeProvider,
  Elements,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe
} from 'react-stripe-elements'
import keysContext from '../context/keysContext'

type CreditCardFormProps = {
  className?: string,
  stripe?: stripe.Stripe,
  onSubmit: Function
}

const CreditCardForm = injectStripe((props: CreditCardFormProps) => {

  const { className = "", stripe, onSubmit } = props
  const [validation, setValidation] = useState('')
  const [processing, setProcessing] = useState(false)

  if (!stripe) return null

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    setProcessing(true)

    const data = await stripe.createSource({ type: "card" })

    if (data.error) {
      setValidation(data.error.message || '')
      setProcessing(false)
      return
    }

    onSubmit(data.source, setProcessing, setValidation)
  }

  const fieldStyle: any = {
    base: {
      color: "#333",
      fontSize: "16px",
      lineHeight: 1,
      letterSpacing: "1px",
    }
  }

  return (
    <div className={`credit-card-form ${className}`}>
      <div className="credit-card-form__section credit-card-form__section--number">
        <label className="credit-card-form__label">Card Number *</label>
        <div className="credit-card-form__input">
          <CardNumberElement style={fieldStyle} />
        </div>
      </div>

      <div className="credit-card-form__section credit-card-form__section--expiration">
        <label className="credit-card-form__label">Card Expiration *</label>
        <div className="credit-card-form__input">
          <CardExpiryElement style={fieldStyle} />
        </div>
      </div>

      <div className="credit-card-form__section credit-card-form__section--cvc">
        <label className="credit-card-form__label">Card CVC *</label>
        <div className="credit-card-form__input">
          <CardCVCElement style={fieldStyle} />
        </div>
      </div>

      <p className="credit-card-form__validation">{validation}</p>

      <button
        className="button button-primary credit-card-form__submit"
        disabled={processing ? true : false}
        onClick={handleSubmit}
      >
        {processing ? "Processing" : "Submit"}
      </button>
    </div>
  )
})


type StripeFormProps = {
  className?: string,
  onSubmit: Function
}


const StripeForm = (props: StripeFormProps) => {

  const { className, onSubmit } = props
  const [stripe, setStripe] = useState(window.Stripe(''))
  const { keys } = useContext(keysContext)

  useEffect(() => {
    const stripeInstance = window.Stripe(keys.stripePubKey)
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
