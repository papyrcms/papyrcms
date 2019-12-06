import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  StripeProvider,
  Elements,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  injectStripe
} from 'react-stripe-elements'


const handleSubmit = async (event, stripe, setProcessing, setValidation, onSubmit) => {

  event.preventDefault()

  setProcessing(true)

  const data = await stripe.createSource({ type: "card" })

  if (data.error) {
    setValidation(data.error.message)
    setProcessing(false)
    return
  }

  onSubmit(data.source, setProcessing, setValidation)
}


const CreditCardForm = injectStripe(({ className = "", stripe, onSubmit }) => {

  const [validation, setValidation] = useState('')
  const [processing, setProcessing] = useState(false)

  return (
    <div className={`credit-card-form ${className}`}>
      <div className="credit-card-form__section credit-card-form__section--number">
        <label className="credit-card-form__label">Card Number</label>
        <div className="credit-card-form__input">
          <CardNumberElement
            style={{
              base: {
                color: "#333",
                fontSize: "16px"
              }
            }}
          />
        </div>
      </div>

      <div className="credit-card-form__section credit-card-form__section--expiration">
        <label className="credit-card-form__label">Card Expiration</label>
        <div className="credit-card-form__input">
          <CardExpiryElement
            style={{
              base: {
                color: "#333",
                fontSize: "16px"
              }
            }}
          />
        </div>
      </div>

      <div className="credit-card-form__section credit-card-form__section--cvc">
        <label className="credit-card-form__label">Card CVC</label>
        <div className="credit-card-form__input">
          <CardCVCElement
            style={{
              base: {
                color: "#333",
                fontSize: "16px"
              }
            }}
          />
        </div>
      </div>

      <p className="credit-card-form__validation">{validation}</p>

      <button
        className="button button-primary credit-card-form__submit"
        disabled={processing ? true : false}
        onClick={event => handleSubmit(event, stripe, setProcessing, setValidation, onSubmit)}
      >
        {processing ? "Processing" : "Submit"}
      </button>
    </div>
  )
})


const StripeForm = ({ stripePubKey, className, onSubmit }) => {

  const [stripe, setStripe] = useState(null)
  useEffect(() => setStripe(window.Stripe(stripePubKey)), [])

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CreditCardForm className={className} onSubmit={onSubmit} />
      </Elements>
    </StripeProvider>
  )
}


const mapStateToProps = ({ stripePubKey }) => {
  return { stripePubKey }
}


export default connect(mapStateToProps)(StripeForm)
