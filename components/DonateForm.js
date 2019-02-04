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

    this.state = { amount: 1.00, processing: false, paid: false }
  }


  async handleSubmit( event ) {

    event.preventDefault()

    this.setState({ processing: true })

    console.log(this.stripe)

    const response = await this.props.stripe.createSource({ type: 'card' })
    response.amount = this.state.amount

    axios.post( '/api/donate', response )
      .then(response => { 
        console.log(response.data)
        if ( response.data.status === 'succeeded' ) {
          this.setState({ paid: true })
        }
      })
      .catch(error => {
        console.error(error)
        this.setState({ processing: false })
      })
  }


  renderForm() {

    const { amount, processing, paid } = this.state
    const { title, posts } = this.props

    if ( !paid ) {
      return (
        <form className="donate-form" onSubmit={ this.handleSubmit.bind(this) }>

          <SectionStandard
            title={ title }
            posts={ posts }
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
                value={ amount }
                className="donate-form__input"
                onChange={ event => this.setState({ amount: event.target.value }) }
              />
            </div>

            <input
              type="submit"
              className="button button-primary donate-form__submit"
              value={ processing ? 'Processing' : 'Submit' }
              disabled={ processing ? true : false }
            />

          </div>

        </form>
      )
    } else {
      return <h3 className="heading-tertiary donate-form">Thank you for your donation!</h3>
    }
  }


  render() {
    
    return this.renderForm()
  }
}


export default injectStripe( DonateForm )
