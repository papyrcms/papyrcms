const Controller = require('./abstractController')
const PageModel = require('../models/page')
const { checkIfAdmin } = require('../utilities/middleware')


class PageRoutes extends Controller {

  registerRoutes() {

    this.server.get('/', this.renderPage.bind(this))
    this.server.get('/:page', this.renderPage.bind(this))

    this.server.get('/page-builder', this.renderPageBuilder.bind(this))
    this.server.get('/pages/:page', this.renderPageBuilder.bind(this))

    this.server.post(
      '/api/page',
      checkIfAdmin,
      this.savePage.bind(this)
    )
    this.server.get(
      '/api/page',
      checkIfAdmin,
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

      const queryParams = { page: req.params.page, pageObject: foundPage }
      const actualPage = '/page'

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
    const actualPage = '/page-builder'

    if (req.params.page) {
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
      className: req.body.className,
      route: req.body.route,
      sections: []
    })

    // Map tags string to an array
    for (const section of req.body.sections) {
      section.tags = this.mapSectionTagsToArray(section.tags)
      page.sections.push(JSON.stringify(section))
    }

    await page.save()
    res.send(page)
  }


  async updatePage(req, res) {

    const updatedPage = {
      className: req.body.className,
      route: req.body.route,
      sections: []
    }

    // Map tags string to an array
    for (const section of req.body.sections) {
      section.tags = this.mapSectionTagsToArray(section.tags)
      updatedPage.sections.push(JSON.stringify(section))
    }

    await PageModel.findOneAndUpdate({ _id: req.params.id }, updatedPage)

    res.send(updatedPage)
  }


  async deletePage(req, res) {

    await PageModel.findByIdAndDelete(req.params.id)
    res.send('Page deleted.')
  }
}

module.exports = PageRoutes