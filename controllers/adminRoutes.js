const _ = require('lodash')
const Controller = require('./abstractController')
const SettingsModel = require('../models/settings')
const UserModel = require('../models/user')
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
    this.server.get(
      '/api/admin/users', 
      checkIfAdmin, 
      this.sendAllUsers.bind(this)
    )
    this.server.post(
      '/api/admin/settings', 
      checkIfAdmin, 
      sanitizeRequestBody, 
      this.changeSettings.bind(this)
    )
  }


  async fetchAllUsers() {

    const users = await UserModel.find()

    return users
  }


  async sendAllUsers(req, res) {

    const users = await this.fetchAllUsers()

    res.send(users)
  }


  async renderPage(req, res) {

    const users = await this.fetchAllUsers()
    const queryParams = { users }

    this.app.render(req, res, req.url, queryParams)
  }


  async changeSettings(req, res) {

    const settings = await SettingsModel.find()

    settings.forEach(setting => {

      _.map(req.body, async (value, key) => {
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
      })
    })

    res.send(req.body)
  }
}


module.exports = AdminRoutes
