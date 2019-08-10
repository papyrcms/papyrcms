const Controller = require('./abstractController')
const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretTestKey)
const { sanitizeRequestBody } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')


class PaymentRoutes extends Controller {

  registerSettings() {

    // Middleware to configure payment settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableDonations: false }
      const settings = await configureSettings('payment', defaultSettings)

      Object.keys(settings).forEach(optionKey => {
        const optionValue = settings[optionKey]

        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }


  registerRoutes() {

    // Views
    this.server.get(
      '/donate', 
      this.donationEnabled, 
      this.renderPage.bind(this)
    )

    // Message API
    this.server.post(
      '/api/donate', 
      this.donationEnabled, 
      sanitizeRequestBody, 
      this.createDonation.bind(this)
    )
    this.server.post(
      '/api/stripePubKey', 
      this.donationEnabled, 
      sanitizeRequestBody, 
      this.sendStripePubKey.bind(this)
    )
  }


  donationEnabled(req, res, next) {

    if (res.locals.settings.enableDonations) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  async createDonation(req, res) {

    const { id, amount, email } = req.body
    const paymentDetails = {
      source: id,
      amount: amount * 100,
      receipt_email: email,
      currency: 'usd',
      description: 'Single donation'
    }

    const charge = await this.makePayment(paymentDetails)

    res.send(charge)
  }


  async makePayment(paymentDetails) {

    const charge = await stripe.charges.create(paymentDetails)

    return charge
  }


  renderPage(req, res) {

    const actualPage = '/donate'

    this.app.render(req, res, actualPage)
  }


  sendStripePubKey(req, res) {

    if (keys.rootURL.includes(req.get('host'))) {
      res.send(keys.stripePublishableTestKey)
    } else {
      res.send('nunya beezwax')
    }
  }
}

module.exports = PaymentRoutes
