const cloudinary = require('cloudinary')
const multer = require('multer')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const keys = require('../config/keys')

class BlogRoutes {

  constructor(server, app) {

    this.server = server
    this.app = app

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get('/blog', this.renderPage.bind(this, ''))
    this.server.get('/blog/all', this.renderPage.bind(this, '_all'))
    this.server.get('/blog/new', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_create'))
    this.server.get('/blog/:id', this.renderPage.bind(this, '_show'))
    this.server.get('/blog/:id/edit', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_edit'))

    // Blog API
    this.server.post('/api/blogs', this.checkIfAdmin.bind(this), this.createBlog.bind(this))
    this.server.get('/api/blogs', this.checkIfAdmin.bind(this), this.sendAllBlogs.bind(this))
    this.server.get('/api/published_blogs', this.sendPublishedBlogs.bind(this))
    this.server.get('/api/blogs/:id', this.sendOneBlog.bind(this))
    this.server.put('/api/blogs/:id', this.checkIfAdmin.bind(this), this.updateBlog.bind(this))
    this.server.delete('/api/blogs/:id', this.checkIfAdmin.bind(this), this.deleteBlog.bind(this))
  }


  checkIfAdmin(req, res, next) {

    if (req.user && req.user.isAdmin) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  allowUserComments(req, res, next) {

    const { settings, currentUser } = res.locals

    if (settings.enableCommenting || (currentUser && currentUser.isAdmin)) {
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

    const blog = new PostModel(req.body)
    blog.author = req.user
    blog.type = 'blog'

    blog.save()
    res.send(blog)
  }


  async sendAllBlogs(req, res) {

    const foundBlogs = await PostModel.find({ type: 'blog' }).sort({ created: -1 })

    res.send(foundBlogs)
  }


  async sendPublishedBlogs(req, res) {

    const foundBlogs = await PostModel.find({ published: true, type: 'blog' }).sort({ created: -1 })

    res.send(foundBlogs)
  }


  async sendOneBlog(req, res) {

    const foundBlog = await PostModel.findById(req.params.id)
      .populate('author')
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })

    res.send(foundBlog)
  }


  async updateBlog(req, res) {

    const updatedBlog = await PostModel.findOneAndUpdate({ _id: req.params.id }, req.body)

    res.send(updatedBlog)
  }


  async deleteBlog(req, res) {

    const blog = await PostModel.findById(req.params.id)

    blog.comments.forEach(async comment => {
      await CommentModel.findOneAndDelete({ _id: comment })
    })

    await PostModel.findByIdAndDelete(req.params.id)

    res.send('blog deleted')
  }
}


module.exports = BlogRoutes
