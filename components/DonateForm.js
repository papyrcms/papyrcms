import React, { Component } from 'react'
import { 
  injectStripe, 
  CardCVCElement, 
  CardExpiryElement, 
  CardNumberElement 
} from 'react-stripe-elements'
import SectionStandard from '../components/SectionStandard'
import axios from 'axios';

class DonateForm extends Component {

  constructor( props ) {

    super( props )

    this.state = { amount: 1.00 }
  }


  async handleSubmit( event ) {

    event.preventDefault()

    const response = await this.props.stripe.createSource({ type: 'card' })
    response.amount = this.state.amount

    axios.post( '/api/donate', response )
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }


  render() {

    return (
      <form className="donate-form" onSubmit={ this.handleSubmit.bind(this) }>

        <SectionStandard
          title={ this.props.title }
          posts={ this.props.posts }
        />

        <div className="donate-form__card-section">

          <div className="donate-form__section donate-form__section--number">
            <label className="donate-form__label">Card Number</label>
            <div className="donate-form__input">
              <CardNumberElement 
                style={{ base: { 
                  color: '#333' 
                }}}
              />
            </div>
          </div>

          <div className="donate-form__section donate-form__section--expiration">
            <label className="donate-form__label">Card Expiration</label>
            <div className="donate-form__input">
              <CardExpiryElement 
                style={{ base: { 
                  color: '#333' 
                }}}
              />
            </div>
          </div>

          <div className="donate-form__section donate-form__section--cvc">
            <label className="donate-form__label">Card CVC</label>
            <div className="donate-form__input">
              <CardCVCElement 
                style={{ base: { 
                  color: '#333' 
                }}}
              />
            </div>
          </div>

          <div className="donate-form__section donate-form__section--amount">
            <label className="donate-form__label">Amount</label>
            <input
              type="number"
              min="1"
              step=".01"
              value={this.state.amount}
              className="donate-form__input"
              onChange={event => this.setState({ amount: event.target.value })}
            />
          </div>

          <input
            type="submit"
            className="button button-primary donate-form__submit"
          />

        </div>

      </form>
    )
  }
}


export default injectStripe( DonateForm )
