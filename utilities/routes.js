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
  }


  async renderLanding(req, res) {

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