const Controller = require('./abstractController')
const MessageModel = require('../models/message')
const Mailer = require('./mailer')
const keys = require('../config/keys')
const { configureSettings } = require('../utilities/functions')
const { sanitizeRequestBody, checkIfAdmin } = require('../utilities/middleware')

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
    this.server.get(
      '/api/messages',
      checkIfAdmin,
      this.sendAllMessages.bind(this)
    )
    this.server.delete(
      '/api/messages/:id',
      checkIfAdmin,
      this.deleteMessage.bind(this)
    )
  }


  renderPage(req, res) {

    const actualPage = '/contact'

    this.app.render(req, res, actualPage)
  }


  async sendAllMessages(req, res) {

    const messages = await MessageModel.find().sort({ created: -1 })

    res.send(messages)
  }


  async deleteMessage(req, res) {

    const { id } = req.params
    await MessageModel.findByIdAndDelete(id)

    res.send('message deleted')
  }


  createMessage(req, res) {

    const { contactName, contactEmail, contactMessage } = req.body
    const messageObj = {
      name: contactName,
      email: contactEmail,
      message: contactMessage
    }
    const message = new MessageModel(messageObj)

    if (res.locals.settings.enableEmailingToAdmin) {

      const mailer = new Mailer()
      const templatePath = 'emails/contact.html'
      const subject = `New message from ${message.name}!`

      const sent = mailer.sendEmail(message, templatePath, keys.adminEmail, subject)

      if (sent) {
        message.emailSent = true
      }
    }

    message.save()
    res.send(message)
  }
}


module.exports = ContactRoutes
