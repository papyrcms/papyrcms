const keys = require('../config/keys')

class UtilityRoutes {

  constructor(server, app) {

    this.server = server
    this.app = app

    this.registerRoutes()
  }


  registerRoutes() {

    this.server.get('/', this.renderLanding.bind(this))
    this.server.post('/api/googleAnalyticsId', this.sendGoogleAnalyticsId)
    this.server.post('/api/googleMapsKey', this.sendGoogleMapsKey)
    this.server.get('/.well-known/acme-challenge/jF3NwtV-cPO87squ85GYih5h-8bo1rnMqz5L9UcZxSw', this.certbot)
  }


  certbot(req, res) {
    res.send('jF3NwtV-cPO87squ85GYih5h-8bo1rnMqz5L9UcZxSw.L34vb6OgvUvit8D5FoBZoKO0Jjf-n3dlqtKE0cLzs8I')
  }


  renderLanding(req, res) {

    const actualPage = '/index'
    const queryParams = { googleMapsKey: keys.googleMapsKey }

    this.app.render(req, res, actualPage, queryParams)
  }


  sendGoogleAnalyticsId(req, res) {
    res.send(keys.googleAnalyticsId)
  }


  sendGoogleMapsKey(req, res) {
    res.send(keys.googleMapsKey)
  }
}

module.exports = UtilityRoutes