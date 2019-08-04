import React from 'react'
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement
} from 'react-stripe-elements'


const CreditCardForm = ({ className = '' }) => (
  <div className={`credit-card-form ${className}`}>
    <div className="credit-card-form__section credit-card-form__section--number">
      <label className="credit-card-form__label">Card Number</label>
      <div className="credit-card-form__input">
        <CardNumberElement
          style={{
            base: {
              color: '#333',
              fontSize: '16px'
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
              color: '#333',
              fontSize: '16px'
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
              color: '#333',
              fontSize: '16px'
            }
          }}
        />
      </div>
    </div>
  </div>
)


export default CreditCardForm
