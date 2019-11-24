const Controller = require('./abstractController')
const PageModel = require('../models/page')
const keys = require('../config/keys')
const { checkIfAdmin } = require('../utilities/middleware')


class PageRoutes extends Controller {

  registerRoutes() {

    this.server.get('/:page', this.renderPage.bind(this))

    this.server.get(
      '/api/page/:page',
      this.sendPage.bind(this)
    )
    this.server.post(
      '/api/page',
      checkIfAdmin,
      this.savePage.bind(this)
    )
  }


  async renderPage(req, res, next) {

    const page = await PageModel.findOne({ route: req.params.page })
    if (page) {

      const queryParams = { page }
      const actualPage = '/page'

      this.app.render(req, res, actualPage, queryParams)
    } else {
      // If we do not have the page saved in the DB
      // Move foreward as if this is a middleware so that
      // we can check for a static page template or 404
      next()
    }
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

    const page = await PageModel.findOne({ route: req.params.page })
    if (page) {
      res.send(page)
    } else {
      res.status(401).send({ message: 'This page does not exist. Sorry.' })
    }
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
}

module.exports = PageRoutes