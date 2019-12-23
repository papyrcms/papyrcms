const Controller = require('./abstractController')
const keys = require('../config/keys')
const Payments = require('../utilities/payments')
const { sanitizeRequestBody } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')


class DonationController extends Controller {

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

    // Message API
    this.server.post(
      '/api/donate',
      this.createDonation.bind(this)
    )
    this.server.post(
      '/api/stripePubKey',
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

    const chargeInfo = {
      email: req.body.email,
      amount: req.body.amount,
      source: req.body.source,
      description: "Single Donation"
    }

    const payments = new Payments()
    const charge = await payments.makePayment(chargeInfo)

    res.send(charge)
  }


  sendStripePubKey(req, res) {
    res.send(keys.stripePublishableTestKey)
  }
}

module.exports = DonationController
