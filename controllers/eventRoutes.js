const Controller = require('./abstractController')
const EventModel = require('../models/event')
const { checkIfAdmin, sanitizeRequestBody } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')
const keys = require('../config/keys')
const _ = require('lodash')

class EventRoutes extends Controller {

  registerSettings() {

    // Middleware to configure comment settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableEvents: false }
      const settings = await configureSettings('event', defaultSettings)

      _.map(settings, (optionValue, optionKey) => {
        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }

  registerRoutes() {

    // Views
    this.server.get(
      '/events',
      this.renderPage.bind(this, '')
    )
    this.server.get(
      '/events/all',
      this.renderPage.bind(this, '_all')
    )
    this.server.get(
      '/events/new',
      checkIfAdmin,
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/events/:id',
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/events/:id/edit',
      checkIfAdmin,
      this.renderPage.bind(this, '_edit')
    )

    // Event API
    this.server.post(
      '/api/events',
      checkIfAdmin,
      sanitizeRequestBody,
      this.createEvent.bind(this)
    )
    this.server.get(
      '/api/events',
      checkIfAdmin,
      this.sendAllEvents.bind(this)
    )
    this.server.get(
      '/api/published_events',
      this.sendPublishedEvents.bind(this)
    )
    this.server.get(
      '/api/events/:id',
      this.sendOneEvent.bind(this)
    )
    this.server.put(
      '/api/events/:id',
      checkIfAdmin,
      sanitizeRequestBody,
      this.updateEvent.bind(this)
    )
    this.server.delete(
      '/api/events/:id',
      checkIfAdmin,
      this.deleteEvent.bind(this)
    )
  }


  renderPage(pageExtension, req, res) {

    const actualPage = `/events${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id, currentUser: req.user, googleMapsKey: keys.googleMapsKey }

    this.app.render(req, res, actualPage, queryParams)
  }


  createEvent(req, res) {

    const event = new EventModel(req.body)
    event.author = req.user

    event.save()
    res.send(event)
  }


  async sendPublishedEvents(req, res) {

    const foundEvents = await EventModel.find({ published: true }).sort({ created: -1 })

    res.send(foundEvents)
  }


  async sendAllEvents(req, res) {

    const foundEvents = await EventModel.find().sort({ created: -1 })

    res.send(foundEvents)
  }


  async sendOneEvent(req, res) {

    const foundEvent = await EventModel.findById(req.params.id)
      .populate('author')

    res.send(foundEvent)
  }


  async updateEvent(req, res) {

    const updatedEvent = await EventModel.findOneAndUpdate({ _id: req.params.id }, req.body)

    res.send(updatedEvent)
  }


  async deleteEvent(req, res) {

    await EventModel.findByIdAndDelete(req.params.id)

    res.send('event deleted')
  }
}

module.exports = EventRoutes