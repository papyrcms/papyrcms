const keys = require( '../config/keys' )

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


  createDonation( req, res ) {

    console.log(req.body)

    res.send('oh yeah')
  }


  renderPage( req, res ) {

    const actualPage = '/donate'

    this.app.render( req, res, actualPage )
  }


  sendStripePubKey( req, res ) {

    if (`${req.protocol}://${req.get('host')}` === keys.rootURL && req.body.authorize) {
      res.send( keys.stripePublishableTestKey )
    } else {
      res.send('nunya beezwax')
    }
  }
}

module.exports = PaymentRoutes
