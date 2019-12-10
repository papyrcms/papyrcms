const Controller = require('./abstractController')
const keys = require('../config/keys')
const { configureSettings } = require('../utilities/functions')


class UtilityController extends Controller {

  registerSettings() {

    // configure main app settings
    server.use(async (req, res, next) => {

      const defaultSettings = { enableMenu: false }
      const settings = await configureSettings('app', defaultSettings)

      Object.keys(settings).forEach(optionKey => {
        const optionValue = settings[optionKey]

        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }


  registerRoutes() {

    this.server.post('/api/googleAnalyticsId', this.sendGoogleAnalyticsId)
    this.server.post('/api/googleMapsKey', this.sendGoogleMapsKey)
    this.server.get('/.well-known/acme-challenge/jF3NwtV-cPO87squ85GYih5h-8bo1rnMqz5L9UcZxSw', this.certbot)
  }


  certbot(req, res) {
    res.send('jF3NwtV-cPO87squ85GYih5h-8bo1rnMqz5L9UcZxSw.L34vb6OgvUvit8D5FoBZoKO0Jjf-n3dlqtKE0cLzs8I')
  }


  sendGoogleAnalyticsId(req, res) {
    res.send(keys.googleAnalyticsId)
  }


  sendGoogleMapsKey(req, res) {
    res.send(keys.googleMapsKey)
  }
}

module.exports = UtilityController