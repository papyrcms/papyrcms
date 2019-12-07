const Controller = require('./abstractController')
const PageModel = require('../models/page')
const { checkIfAdmin } = require('../utilities/middleware')
const keys = require('../config/keys')


class PageController extends Controller {

  registerRoutes() {

    this.server.get('/', this.renderPage.bind(this))
    this.server.get('/:page', this.renderPage.bind(this))

    this.server.get(
      '/admin/pages/:page',
      checkIfAdmin,
      this.renderPageBuilder.bind(this)
    )

    this.server.post(
      '/api/page',
      checkIfAdmin,
      this.savePage.bind(this)
    )
    this.server.get(
      '/api/page',
      this.sendPages.bind(this)
    )
    this.server.get(
      '/api/page/:page',
      this.sendPage.bind(this)
    )
    this.server.put(
      '/api/page/:id',
      checkIfAdmin,
      this.updatePage.bind(this)
    )
    this.server.delete(
      '/api/page/:id',
      checkIfAdmin,
      this.deletePage.bind(this)
    )
  }


  async renderPage(req, res, next) {

    if (!req.params.page) {
      req.params.page = 'home'
    }

    if (req.params.page === 'pages') {
      return this.app.render(req, res, '/pages')
    }

    const foundPage = await PageModel.findOne({ route: req.params.page }).lean()
    if (foundPage) {

      const queryParams = {
        page: req.params.page,
        pageObject: foundPage,
        googleMapsKey: keys.googleMapsKey,
        stripePubKey: keys.stripePublishableTestKey
      }
      const actualPage = '/_page'

      this.app.render(req, res, actualPage, queryParams)
    } else {

      // If we do not have the page saved in the DB
      // Move foreward as if this is a middleware so that
      // we can check for a static page template or 404
      next()
    }
  }


  async renderPageBuilder(req, res) {

    const queryParams = {}
    const actualPage = '/admin/page-builder'

    if (req.params.page) {
      queryParams.page = req.params.page
      queryParams.googleMapsKey = keys.googleMapsKey,
      queryParams.stripePubKey = keys.stripePublishableTestKey

      const foundPage = await PageModel.findOne({ route: req.params.page }).lean()
      if (foundPage) {
        queryParams.pageObject = foundPage
      }
    }

    this.app.render(req, res, actualPage, queryParams)
  }


  mapSectionTagsToArray(tags) {

    const newTags = tags.split(',').map(tag => {

      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) {
        return pendingTag
      }
    })

    return newTags
  }


  async sendPage(req, res) {

    const page = await PageModel.findOne({ route: req.params.page }).lean()
    if (page) {
      res.send(page)
    } else {
      res.status(401).send({ message: 'This page does not exist. Sorry.' })
    }
  }


  async sendPages(req, res) {

    const pages = await PageModel.find().sort({ created: -1 }).lean()
    res.send(pages)
  }


  async savePage(req, res) {

    const page = new PageModel({
      title: req.body.title,
      className: req.body.className,
      route: req.body.route,
      navOrder: req.body.navOrder,
      css: req.body.css,
      sections: []
    })

    // Make sure the page has a route
    if (!page.route) {
      res.status(401).send({ message: 'Please choose a page route.' })
    }

    // Map tags string to an array
    for (const section of req.body.sections) {

      // Make sure the section has tags
      if (
        !section.tags &&
        section.type !== 'ContactForm' &&
        section.type !== 'DonateForm'
      ) {
        res.status(401).send({ message: 'Please add at least one required tag to each section.' })
      }

      // Make sure the section has a valid maxPosts
      if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
        res.status(401).send({ message: 'You can only choose positive integers for max posts.' })
      }

      section.tags = this.mapSectionTagsToArray(section.tags)
      page.sections.push(JSON.stringify(section))
    }

    // Make sure the page has at least one section
    if (page.sections.length === 0) {
      res.status(401).send({ message: 'Please add at least one section.' })
    }

    try {
      await page.save()
      res.send(page)
    } catch (e) {

      let message = 'There was a problem. Try again later.'
      if (e.code === 11000) {
        message = 'You have already saved a page with this route. Go change that one or choose another route.'
      }

      res.status(401).send({ message })
    }
  }


  async updatePage(req, res) {

    const page = {
      title: req.body.title,
      className: req.body.className,
      route: req.body.route,
      navOrder: req.body.navOrder,
      css: req.body.css,
      sections: []
    }

    if (!page.route) {
      res.status(401).send({ message: 'Please choose a page route.' })
    }

    // Map tags string to an array
    for (const section of req.body.sections) {

      // Make sure the section has tags
      if (
        !section.tags &&
        section.type !== 'ContactForm' &&
        section.type !== 'DonateForm'
      ) {
        res.status(401).send({ message: 'Please add at least one required tag to each section.' })
      }

      // Make sure the section has a valid maxPosts
      if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
        res.status(401).send({ message: 'You can only choose positive integers for max posts.' })
      }

      section.tags = this.mapSectionTagsToArray(section.tags)
      page.sections.push(JSON.stringify(section))
    }

    // Make sure the page has at least one section
    if (page.sections.length === 0) {
      res.status(401).send({ message: 'Please add at least one section.' })
    }

    try {
      await PageModel.findOneAndUpdate({ _id: req.params.id }, page)
      res.send(page)
    } catch (e) {

      let message = 'There was a problem. Try again later.'
      if (e.code === 11000) {
        message = 'You have already saved a page with this route. Go change that one or choose another route.'
      }

      res.status(401).send({ message })
    }
  }


  async deletePage(req, res) {

    await PageModel.findByIdAndDelete(req.params.id)
    res.send('Page deleted.')
  }
}

module.exports = PageController