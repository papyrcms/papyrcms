const Controller = require('./abstractController')
const MessageModel = require('../models/message')
const Mailer = require('./mailer')
const keys = require('../config/keys')
const { configureSettings } = require('../utilities/functions')
const { sanitizeRequestBody } = require('../utilities/middleware')

class ContactRoutes extends Controller {

  registerSettings() {

    // Middleware to configure email settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { 
        enableEmailingToAdmin: true,
        enableEmailingToUsers: false
      }
      const settings = await configureSettings('email', defaultSettings)

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
      '/contact', 
      this.renderPage.bind(this)
    )

    // Message API
    this.server.post(
      '/api/contact', 
      sanitizeRequestBody, 
      this.createMessage.bind(this)
    )
  }


  renderPage(req, res) {

    const actualPage = '/contact'

    this.app.render(req, res, actualPage)
  }


  createMessage(req, res) {

    if (res.locals.settings.enableEmailingToAdmin) {

      const { contactName, contactEmail, contactMessage } = req.body
      const messageObj = {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      }
      const message = new MessageModel(messageObj)

      const mailer = new Mailer()
      const templatePath = 'emails/contact.html'
      const subject = `New message from ${message.name}!`

      const sent = mailer.sendEmail(message, templatePath, keys.adminEmail, subject)

      if (sent) {
        message.emailSent = true
      }

      message.save()
      res.send(message)
    }
  }
}


module.exports = ContactRoutes
