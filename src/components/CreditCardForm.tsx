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


const CreditCardForm = injectStripe<any>(({ className = "", stripe, onSubmit }) => {

  const [validation, setValidation] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async event => {
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
        onClick={event => handleSubmit(event)}
      >
        {processing ? "Processing" : "Submit"}
      </button>
    </div>
  )
})


const StripeForm = props => {

  const { stripePubKey, className, onSubmit } = props
  const [stripe, setStripe] = useState(null)

  useEffect(() => {setStripe(window.Stripe(stripePubKey))}, [])

  return (
    <StripeProvider stripe={stripe}>
      <Elements>
        <CreditCardForm className={className} onSubmit={onSubmit} />
      </Elements>
    </StripeProvider>
  )
}


const mapStateToProps = state => {
  return { stripePubKey: state.stripePubKey }
}


export default connect(mapStateToProps)(StripeForm)
