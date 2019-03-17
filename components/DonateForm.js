import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  injectStripe, 
  CardCVCElement, 
  CardExpiryElement, 
  CardNumberElement 
} from 'react-stripe-elements'
import SectionStandard from '../components/SectionStandard'
import axios from 'axios'

class DonateForm extends Component {

  constructor( props ) {

    super( props )

    this.state = {
      email: props.currentUser ? props.currentUser.email : '', 
      amount: 1.00, 
      processing: false, 
      paid: false,
      validation: ''
    }
  }


  async handleSubmit( event ) {

    event.preventDefault()

    this.setState({ processing: true })

    const { amount, email } = this.state
    const data = await this.props.stripe.createSource({ type: 'card' })
    let message = ''

    switch ( true ) {
      case !!data.error:
        message = data.error.message
        return this.setState({ processing: false, validation: message })

      case amount < 1:
        message = 'You must donate at least 1 dollar.'
        return this.setState({ processing: false, validation: message })

      case email === '':
        message = 'Please enter your email.'
        return this.setState({ processing: false, validation: message })

      default:

        data.amount = amount
        data.email = email

        axios.post( '/api/donate', data )
          .then(response => { 
            console.log(response.data)
            if ( response.data.status === 'succeeded' ) {
              this.setState({ paid: true })
            }
          })
          .catch(error => {
            console.error(error)
            message = 'Something went wrong. Please try again later.'
            this.setState({ processing: false, validation: message })
          })
    }
  }


  renderForm() {

    const { amount, email, processing, paid, validation } = this.state
    const { title, posts } = this.props

    if ( !paid ) {
      return (
        <form className="donate-form" onSubmit={ this.handleSubmit.bind(this) }>

          <SectionStandard
            title={ title }
            posts={ posts }
          />

          <div className="donate-form__card-section">

            <div className="donate-form__section donate-form__section--email">
              <label className="donate-form__label">Email</label>
              <input
                type="email"
                value={email}
                className="donate-form__input"
                onChange={event => this.setState({ email: event.target.value })}
              />
            </div>

            <div className="donate-form__section donate-form__section--amount">
              <label className="donate-form__label">Amount</label>
              <input
                type="number"
                min="1"
                step=".01"
                value={amount}
                className="donate-form__input"
                onChange={event => this.setState({ amount: event.target.value })}
              />
            </div>

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

            <p className="donate-form__validation">{ validation }</p>

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


const mapStateToProps = state => {
  return { currentUser: state.currentUser }
}


export default injectStripe( connect( mapStateToProps )( DonateForm ) )
