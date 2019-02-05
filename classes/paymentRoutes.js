const keys = require( '../config/keys' )
const stripe = require( 'stripe' )( keys.stripeSecretTestKey )

class PaymentRoutes {

  constructor( server, app ) {

    this.server = server
    this.app = app

    this.registerRoutes()
  }
  
  
  registerRoutes() {

    // Views
    this.server.get( '/donate', this.donationEnabled, this.renderPage.bind( this ) )

    // Message API
    this.server.post('/api/donate', this.donationEnabled, this.createDonation.bind( this ) )
    this.server.post('/api/stripePubKey', this.donationEnabled, this.sendStripePubKey.bind( this ) )
  }


  donationEnabled( req, res, next ) {

    if ( res.locals.settings.enableDonations ) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  async createDonation( req, res ) {

    const { source, amount, email } = req.body
    const paymentDetails = {
      source: source.id,
      amount: amount * 100,
      receipt_email: email,
      currency: 'usd',
      description: 'Single donation'
    }

    const charge = await this.makePayment( paymentDetails )

    res.send( charge )
  }


  async makePayment( paymentDetails ) {

    const charge = await stripe.charges.create( paymentDetails )

    return charge
  }


  renderPage( req, res ) {

    const actualPage = '/donate'

    this.app.render( req, res, actualPage )
  }


  sendStripePubKey( req, res ) {

    if ( keys.rootURL.includes( req.get('host') ) ) {
      res.send( keys.stripePublishableTestKey )
    } else {
      res.send('nunya beezwax')
    }
  }
}

module.exports = PaymentRoutes
