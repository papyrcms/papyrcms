const Controller = require('./abstractController')
const MessageModel = require('../models/message')
const Mailer = require('../utilities/mailer')
const keys = require('../config/keys')
const { configureSettings } = require('../utilities/functions')
const { sanitizeRequestBody, checkIfAdmin } = require('../utilities/middleware')

class ContactController extends Controller {

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

    const message = new MessageModel({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    })

    if (res.locals.settings.enableEmailingToAdmin) {

      const mailer = new Mailer()
      const subject = `New message from ${message.name}!`

      const sent = mailer.sendEmail(message, 'contact', keys.adminEmail, subject)

      if (sent) {
        message.emailSent = true
      }
    }

    message.save()
    res.send(message)
  }
}


module.exports = ContactController
