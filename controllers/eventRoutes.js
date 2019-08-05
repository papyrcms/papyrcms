const _ = require('lodash')
const Controller = require('./abstractController')
const EventModel = require('../models/event')
const { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } = require('../utilities/middleware')
const { configureSettings } = require('../utilities/functions')
const keys = require('../config/keys')

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
      this.eventsEnabled,
      this.renderPage.bind(this, '')
    )
    this.server.get(
      '/events/all',
      this.eventsEnabled,
      this.renderPage.bind(this, '_all')
    )
    this.server.get(
      '/events/new',
      this.eventsEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/events/:id',
      this.eventsEnabled,
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/events/:id/edit',
      this.eventsEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_edit')
    )

    // Event API
    this.server.post(
      '/api/events',
      this.eventsEnabled,
      checkIfAdmin,
      sanitizeRequestBody,
      this.validateEvent,
      mapTagsToArray,
      this.createEvent.bind(this)
    )
    this.server.get(
      '/api/events',
      this.eventsEnabled,
      checkIfAdmin,
      this.sendAllEvents.bind(this)
    )
    this.server.get(
      '/api/published_events',
      this.eventsEnabled,
      this.sendPublishedEvents.bind(this)
    )
    this.server.get(
      '/api/events/:id',
      this.eventsEnabled,
      this.sendOneEvent.bind(this)
    )
    this.server.put(
      '/api/events/:id',
      this.eventsEnabled,
      checkIfAdmin,
      sanitizeRequestBody,
      this.validateEvent,
      mapTagsToArray,
      this.updateEvent.bind(this)
    )
    this.server.delete(
      '/api/events/:id',
      this.eventsEnabled,
      checkIfAdmin,
      this.deleteEvent.bind(this)
    )
  }


  eventsEnabled(req, res, next) {

    if (res.locals.settings.enableEvents || req.user && req.user.isAdmin) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  validateEvent(req, res, next) {

    if (!req.body.title) {
      res.status(401).send({ message: 'You need to include a title for your event.' })
    } else if (!req.body.date) {
      res.status(401).send({ message: 'You need to include a date for your event.' })
    } else {
      next()
    }
  }


  renderPage(pageExtension, req, res) {

    const actualPage = `/events${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id, currentUser: req.user, googleMapsKey: keys.googleMapsKey }

    this.app.render(req, res, actualPage, queryParams)
  }


  createEvent(req, res) {

    req.body.date = this.configureDate(req.body.date)

    const event = new EventModel(req.body)
    event.author = req.user

    event.save()
    res.send(event)
  }


  async sendPublishedEvents(req, res) {

    const date = new Date(new Date().toISOString())
    const dateFilter = date.setTime(date.getTime() - 2 * 24 * 60 * 60 * 1000)

    const foundEvents = await EventModel.find({ published: true, date: { $gte: dateFilter } }).sort({ date: 1 })

    res.send(foundEvents)
  }


  async sendAllEvents(req, res) {

    const foundEvents = await EventModel.find().sort({ date: 1 })

    res.send(foundEvents)
  }


  async sendOneEvent(req, res) {

    const foundEvent = await EventModel.findById(req.params.id)
      .populate('author')

    res.send(foundEvent)
  }


  async updateEvent(req, res) {

    req.body.date = this.configureDate(req.body.date)

    const updatedEvent = await EventModel.findOneAndUpdate({ _id: req.params.id }, req.body)

    res.send(updatedEvent)
  }


  async deleteEvent(req, res) {

    await EventModel.findByIdAndDelete(req.params.id)

    res.send('event deleted')
  }
}

module.exports = EventRoutes