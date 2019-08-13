const Controller = require('./abstractController')
const SettingsModel = require('../models/settings')
const UserModel = require('../models/user')
const MessageModel = require('../models/message')
const { checkIfAdmin, sanitizeRequestBody } = require('../utilities/middleware')

class AdminRoutes extends Controller {

  registerRoutes() {

    // Views
    this.server.get(
      '/admin', 
      checkIfAdmin, 
      this.renderPage.bind(this)
    )

    // API
    this.server.post(
      '/api/admin/settings', 
      checkIfAdmin, 
      sanitizeRequestBody, 
      this.changeSettings.bind(this)
    )
  }


  async renderPage(req, res) {

    this.app.render(req, res, req.url)
  }


  async changeSettings(req, res) {

    const settings = await SettingsModel.find()

    for (const setting of settings) {

      for (const key in req.body) {
        
        let value = req.body[key]

        if (typeof setting.options[key] !== 'undefined') {
          switch (value) {
            case 'true':
              value = true
              break
            case 'false':
              value = false
              break
            default: value
          }
          setting.options[key] = value
          await SettingsModel.findOneAndUpdate({ _id: setting._id }, setting)
        }
      }
    }

    res.send(req.body)
  }
}


module.exports = AdminRoutes
