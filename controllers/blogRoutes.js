const Controller = require('./abstractController')
const BlogModel = require('../models/blog')
const CommentModel = require('../models/comment')
const { configureSettings } = require('../utilities/functions')
const { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } = require('../utilities/middleware')

class BlogRoutes extends Controller {

  registerSettings() {

    // Middleware to configure comment settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableBlog: false }
      const settings = await configureSettings('blog', defaultSettings)

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
      '/blog',
      this.blogEnabled,
      this.renderPage.bind(this, '')
    )
    this.server.get(
      '/blog/all',
      this.blogEnabled,
      this.renderPage.bind(this, '_all')
    )
    this.server.get(
      '/blog/new',
      this.blogEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/blog/:id',
      this.blogEnabled,
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/blog/:id/edit',
      this.blogEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, '_edit')
    )

    // Blog API
    this.server.post(
      '/api/blogs',
      this.blogEnabled,
      checkIfAdmin,
      sanitizeRequestBody,
      this.validateBlog,
      mapTagsToArray,
      this.createBlog.bind(this)
    )
    this.server.get(
      '/api/blogs',
      this.blogEnabled,
      checkIfAdmin,
      this.sendAllBlogs.bind(this)
    )
    this.server.get(
      '/api/published_blogs',
      this.blogEnabled,
      this.sendPublishedBlogs.bind(this)
    )
    this.server.get(
      '/api/blogs/:id',
      this.blogEnabled,
      this.sendOneBlog.bind(this)
    )
    this.server.put(
      '/api/blogs/:id',
      this.blogEnabled,
      checkIfAdmin,
      sanitizeRequestBody,
      this.validateBlog,
      mapTagsToArray,
      this.updateBlog.bind(this)
    )
    this.server.delete(
      '/api/blogs/:id',
      this.blogEnabled,
      checkIfAdmin,
      this.deleteBlog.bind(this)
    )
  }


  blogEnabled(req, res, next) {

    if (res.locals.settings.enableBlog || req.user && req.user.isAdmin) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  validateBlog(req, res, next) {

    if (!req.body.title) {
      res.status(401).send({ message: 'You need to include a title for your blog post.' })
    } else if (!req.body.content) {
      res.status(401).send({ message: 'You need to include content for your blog post.' })
    } else {
      next()
    }
  }


  allowUserComments(req, res, next) {

    const { settings } = res.locals

    if (settings.enableCommenting || (req.user && req.user.isAdmin)) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  renderPage(pageExtension, req, res) {

    const actualPage = `/blog${pageExtension}`
    const id = !!req.params ? req.params.id : null

    const queryParams = { id, currentUser: req.user }

    this.app.render(req, res, actualPage, queryParams)
  }


  createBlog(req, res) {

    const blog = new BlogModel(req.body)
    blog.author = req.user
    blog.slug = blog.title.replace(/\s+/g, '-').toLowerCase()

    if ( blog.published ) {
      blog.publishDate = Date.now()
    }

    blog.save()
    res.send(blog)
  }


  async sendAllBlogs(req, res) {

    const foundBlogs = await BlogModel.find().sort({ publishDate: -1, created: -1 }).lean()

    res.send(foundBlogs)
  }


  async sendPublishedBlogs(req, res) {

    const foundBlogs = await BlogModel.find({ published: true }).sort({ publishDate: -1 }).lean()

    res.send(foundBlogs)
  }


  async sendOneBlog(req, res) {

    let foundBlog
    try {
      foundBlog = await BlogModel.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch(e) {
      foundBlog = await BlogModel.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    res.send(foundBlog)
  }


  async updateBlog(req, res) {

    const oldBlog = await BlogModel.findById(req.params.id)

    if ( !oldBlog.published && req.body.published ) {
      req.body.publishDate = Date.now()
    }

    req.body.slug = req.body.title.replace(/\s+/g, '-').toLowerCase()

    const updatedBlog = await BlogModel.findOneAndUpdate({ _id: req.params.id }, req.body)

    res.send(updatedBlog)
  }


  async deleteBlog(req, res) {

    const { id } = req.params
    const blog = await BlogModel.findById(id)

    blog.comments.forEach(async comment => {
      await CommentModel.findOneAndDelete({ _id: comment })
    })

    await BlogModel.findByIdAndDelete(id)

    res.send('blog deleted')
  }
}


module.exports = BlogRoutes
