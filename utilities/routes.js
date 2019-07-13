const Post = require('../models/post')
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
    const posts = await Post.find({ published: true }).sort({ created: -1 })
    const queryParams = { posts, googleMapsKey: keys.googleMapsKey }

    this.app.render(req, res, actualPage, queryParams)
  }


  sendGoogleAnalyticsId(req, res) {

    if (keys.rootURL.includes(req.get('host'))) {
      res.send(keys.googleAnalyticsId)
    } else {
      res.send('nunya beezwax')
    }
  }


  sendGoogleMapsKey(req, res) {

    if (keys.rootURL.includes(req.get('host'))) {
      res.send(keys.googleMapsKey)
    } else {
      res.send('nunya beezwax')
    }
  }
}

module.exports = UtilityRoutes