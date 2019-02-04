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

    const { source, amount } = req.body

    // const charge = await stripe.charges.create({
    //   source: source.id,
    //   amount: amount * 100,
    //   currency: 'usd',
    //   description: 'Anonymous donation'
    // })

    // res.send( charge )
  }


  renderPage( req, res ) {

    const actualPage = '/donate'

    this.app.render( req, res, actualPage )
  }


  sendStripePubKey( req, res ) {
    console.log(`${req.protocol}://${req.get('host')}`, keys.rootURL, req.body.authorize)
    if (`${req.protocol}://${req.get('host')}` === keys.rootURL && req.body.authorize) {
      res.send( keys.stripePublishableTestKey )
    } else {
      res.send('nunya beezwax')
    }
  }
}

module.exports = PaymentRoutes
