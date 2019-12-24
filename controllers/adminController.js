import Controller from './abstractController'
import Settings from '../models/settings'
import { checkIfAdmin, sanitizeRequestBody } from '../utilities/middleware'

class AdminController extends Controller {

  registerRoutes() {

    // API
    this.server.post(
      '/api/admin/settings',
      checkIfAdmin,
      sanitizeRequestBody,
      this.changeSettings.bind(this)
    )
  }


  async changeSettings(req, res) {

    const settings = await Settings.find()

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
          await Settings.findOneAndUpdate({ _id: setting._id }, setting)
        }
      }
    }

    res.send(req.body)
  }
}


export default AdminController
