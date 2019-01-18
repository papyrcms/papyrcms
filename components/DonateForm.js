import React, { Component } from 'react'
import { injectStripe, CardElement } from 'react-stripe-elements'

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

        <label>
          Card details
          <CardElement />
        </label>

        <input
          type="submit"
          className="button button-primary"
        />

      </form>
    )
  }
}


export default injectStripe( DonateForm )
