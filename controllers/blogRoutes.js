const Controller = require('./abstractController')
const BlogModel = require('../models/blog')
const CommentModel = require('../models/comment')
const { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } = require('../utilities/middleware')

class BlogRoutes extends Controller {

  registerRoutes() {

    // Views
    this.server.get(
      '/blog', 
      this.renderPage.bind(this, '')
    )
    this.server.get(
      '/blog/all', 
      this.renderPage.bind(this, '_all')
    )
    this.server.get(
      '/blog/new', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/blog/:id', 
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/blog/:id/edit', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_edit')
    )

    // Blog API
    this.server.post(
      '/api/blogs', 
      checkIfAdmin, 
      sanitizeRequestBody, 
      mapTagsToArray,
      this.createBlog.bind(this)
    )
    this.server.get(
      '/api/blogs',
      checkIfAdmin,
      this.sendAllBlogs.bind(this)
    )
    this.server.get(
      '/api/published_blogs', 
      this.sendPublishedBlogs.bind(this)
    )
    this.server.get(
      '/api/blogs/:id', 
      this.sendOneBlog.bind(this)
    )
    this.server.put(
      '/api/blogs/:id', 
      checkIfAdmin, 
      sanitizeRequestBody, 
      mapTagsToArray,
      this.updateBlog.bind(this)
    )
    this.server.delete(
      '/api/blogs/:id', 
      checkIfAdmin, 
      this.deleteBlog.bind(this)
    )
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

    if ( blog.published ) {
      blog.publishDate = Date.now()
    }

    blog.save()
    res.send(blog)
  }


  async sendAllBlogs(req, res) {

    const foundBlogs = await BlogModel.find().sort({ publishDate: -1, created: -1 })

    res.send(foundBlogs)
  }


  async sendPublishedBlogs(req, res) {

    const foundBlogs = await BlogModel.find({ published: true }).sort({ publishDate: -1 })

    res.send(foundBlogs)
  }


  async sendOneBlog(req, res) {

    const foundBlog = await BlogModel.findById(req.params.id)
      .populate('author')
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })

    res.send(foundBlog)
  }


  async updateBlog(req, res) {

    const oldBlog = await BlogModel.findById(req.params.id)

    if ( !oldBlog.published && req.body.published ) {
      req.body.publishDate = Date.now()
    }

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
