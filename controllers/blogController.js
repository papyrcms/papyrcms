import Controller from './abstractController'
import Blog from '../models/blog'
import Comment from '../models/comment'
import { configureSettings } from '../utilities/functions'
import { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } from '../utilities/middleware'

class BlogController extends Controller {

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
      '/blog/:id',
      this.blogEnabled,
      this.renderPage.bind(this, 'show')
    )
    this.server.get(
      '/blog/:id/edit',
      this.blogEnabled,
      checkIfAdmin,
      this.renderPage.bind(this, 'edit')
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
      '/api/publishedBlogs',
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


  async renderPage(pageExtension, req, res, next) {

    let blog
    try {
      blog = await Blog.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch (e) {
      blog = await Blog.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    if (blog) {
      const actualPage = `/blog/${pageExtension}`
      const queryParams = { id: req.params.id, blog, currentUser: req.user }
      this.app.render(req, res, actualPage, queryParams)
    } else {
      next()
    }
  }


  createBlog(req, res) {

    const blog = new Blog(req.body)
    blog.author = req.user
    blog.slug = blog.title.replace(/\s+/g, '-').toLowerCase()

    if ( blog.published ) {
      blog.publishDate = Date.now()
    }

    blog.save()
    res.send(blog)
  }


  async sendAllBlogs(req, res) {

    const foundBlogs = await Blog.find().sort({ publishDate: -1, created: -1 }).lean()

    res.send(foundBlogs)
  }


  async sendPublishedBlogs(req, res) {

    const foundBlogs = await Blog.find({ published: true }).sort({ publishDate: -1 }).lean()

    res.send(foundBlogs)
  }


  async sendOneBlog(req, res) {

    let foundBlog
    try {
      foundBlog = await Blog.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch(e) {
      foundBlog = await Blog.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    res.send(foundBlog)
  }


  async updateBlog(req, res) {

    const oldBlog = await Blog.findById(req.params.id)

    if ( !oldBlog.published && req.body.published ) {
      req.body.publishDate = Date.now()
    }

    req.body.slug = req.body.title.replace(/\s+/g, '-').toLowerCase()

    const updatedBlog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body)

    res.send(updatedBlog)
  }


  async deleteBlog(req, res) {

    const { id } = req.params
    const blog = await Blog.findById(id)

    blog.comments.forEach(async comment => {
      await Comment.findOneAndDelete({ _id: comment })
    })

    await Blog.findByIdAndDelete(id)

    res.send('blog deleted')
  }
}


export default BlogController
