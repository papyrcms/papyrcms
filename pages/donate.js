import React, { Component } from 'react'
import { StripeProvider, Elements } from 'react-stripe-elements'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../config/keys'
import DonateForm from '../components/DonateForm'

class Donate extends Component {

  static async getInitialProps() {

    const rootUrl = keys.rootURL ? keys.rootURL : ''
    const res = await axios.post( `${rootUrl}/api/stripePubKey`, { authorize: true })

    return { stripePubKey: res.data }
  }


  constructor( props ) {

    super( props )

    this.state = { stripe: null }
  }


  componentDidMount() {

    this.setState({ stripe: window.Stripe( this.props.stripePubKey ) })
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


const mapStateToProps = state => {
  return { stripePubKey: state.stripePubKey }
}


export default connect( mapStateToProps )( Donate )
