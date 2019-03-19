const cloudinary = require('cloudinary')
const multer = require('multer')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const keys = require('../config/keys')

class PostRoutes {

  constructor(server, app) {

    this.server = server
    this.app = app

    // Multer config
    const storage = multer.diskStorage({
      filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname)
      }
    })

    const fileFilter = (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|webm)$/i)) {
        return cb(new Error('Only image and video files are allowed!'), false)
      }

      cb(null, true)
    }

    this.upload = multer({ storage, fileFilter })

    // Cloudinary config
    cloudinary.config({
      cloud_name: keys.cloudinaryCloudName,
      api_key: keys.cloudinaryApiKey,
      api_secret: keys.cloudinaryApiSecret
    })

    this.registerRoutes()
  }


  registerRoutes() {

    // Views
    this.server.get('/posts', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_all'))
    this.server.get('/posts/new', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_create'))
    this.server.get('/posts/:id', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_show'))
    this.server.get('/posts/:id/edit', this.checkIfAdmin.bind(this), this.renderPage.bind(this, '_edit'))

    // Post API
    this.server.post('/api/upload', this.checkIfAdmin.bind(this), this.upload.single('file'), this.uploadMedia.bind(this))
    this.server.post('/api/posts', this.checkIfAdmin.bind(this), this.createPost.bind(this))
    this.server.get('/api/posts', this.checkIfAdmin.bind(this), this.sendAllPosts.bind(this))
    this.server.get('/api/published_posts', this.sendPublishedPosts.bind(this))
    this.server.get('/api/posts/:id', this.sendOnePost.bind(this))
    this.server.put('/api/posts/:id', this.checkIfAdmin.bind(this), this.updatePost.bind(this))
    this.server.delete('/api/posts/:id', this.checkIfAdmin.bind(this), this.deletePost.bind(this))

    // Comment API
    this.server.post('/api/post/:id/comments', this.allowUserComments, this.createComment.bind(this))
    this.server.put('/api/post/:id/comments/:comment_id', this.allowUserComments, this.updateComment.bind(this))
    this.server.delete('/api/post/:id/comments/:comment_id', this.allowUserComments, this.deleteComment.bind(this))
  }


  checkIfAdmin(req, res, next) {

    const { currentUser } = res.locals

    if (currentUser && currentUser.isAdmin) {
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

    const actualPage = `/posts${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id }

    this.app.render(req, res, actualPage, queryParams)
  }


  async uploadMedia(req, res) {

    const uploadResponse = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto', angle: 0 })

    res.send(uploadResponse.secure_url)
  }


  createPost(req, res) {

    const post = new PostModel(req.body)
    post.author = req.user

    post.save()
    res.send(post)
  }


  async sendAllPosts(req, res) {

    const foundPosts = await PostModel.find().sort({ created: -1 })

    res.send(foundPosts)
  }


  async sendPublishedPosts(req, res) {

    const foundPosts = await PostModel.find({ published: true }).sort({ created: -1 })

    res.send(foundPosts)
  }


  async sendOnePost(req, res) {

    const foundPost = await PostModel.findById(req.params.id)
      .populate('author')
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })

    res.send(foundPost)
  }


  async updatePost(req, res) {

    const postDocument = { _id: req.params.id }
    const updatedPost = await PostModel.findOneAndUpdate(postDocument, req.body)

    res.send(updatedPost)
  }


  async deletePost(req, res) {

    const post = await PostModel.findById(req.params.id)

    post.comments.forEach(async comment => {
      await CommentModel.findOneAndDelete({ _id: comment })
    })

    await PostModel.findByIdAndDelete(req.params.id)

    res.send('post deleted')
  }


  async createComment(req, res) {

    const { body, user, params } = req
    const comment = new CommentModel({
      content: body.content,
      author: user
    })
    const post = await PostModel.findById(params.id)

    comment.save()
    post.comments.push(comment)
    post.save()
    res.send(comment)
  }


  async updateComment(req, res) {

    const commentDocument = { _id: req.params.comment_id }
    const updatedComment = await CommentModel.findOneAndUpdate(commentDocument, req.body)

    res.send(updatedComment)
  }


  async deleteComment(req, res) {

    const post = await PostModel.findById(req.params.id)

    post.comments.forEach((comment, i) => {
      if (req.params.comment_id === comment._id.toString()) {
        post.comments.splice(i, 1)
      }
    })
    post.save()

    await CommentModel.findOneAndDelete({ _id: req.params.comment_id })

    res.send(req.params.comment_id)
  }
}


module.exports = PostRoutes
