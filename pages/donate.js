import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import keys from '../config/keys'
import DonateForm from '../components/DonateForm'

class Donate extends Component {

  constructor( props ) {

    super( props )

    this.state = { stripe: null }
  }


  componentDidMount() {

    this.setState({ stripe: window.Stripe( keys.stripePublishableTestKey ) })
  }


  render() {
    
    return (
      <div>
        <h2 className="heading-secondary">Donation</h2>
        <StripeProvider stripe={this.state.stripe}>
          <Elements>
            <DonateForm />
          </Elements>
        </StripeProvider>
      </div>
    ) 
  }
}


export default Donate
