import React, { Component } from 'react'
import { injectStripe, CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements'

class DonateForm extends Component {

  constructor( props ) {
    
    super( props )

    this.state = { elements: null, card: null }
  }


  handleSubmit( event ) {

    event.preventDefault()

    console.log(event.target)
  }


  render() {

    return (
      <form onSubmit={this.handleSubmit.bind(this)}>

        <label>Card Number</label>
        <CardNumberElement />

        <label>Card Expiration</label>
        <CardExpiryElement />

        <label>Card CVC</label>
        <CardCVCElement />

        <input
          type="submit"
          className="button button-primary"
        />

      </form>
    )
  }
}


export default injectStripe( DonateForm )
