const cloudinary = require('cloudinary')
const multer = require('multer')
const Controller = require('./abstractController')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const Mailer = require('../utilities/mailer')
const keys = require('../config/keys')
const { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } = require('../utilities/middleware')

class PostController extends Controller {

  constructor(server, app) {

    super(server, app)

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
  }


  registerRoutes() {

    // Views
    this.server.get(
      '/posts/:id',
      checkIfAdmin,
      this.renderPage.bind(this, 'show')
    )
    this.server.get(
      '/posts/:id/edit',
      checkIfAdmin,
      this.renderPage.bind(this, 'edit')
    )

    // Post API
    this.server.post(
      '/api/upload',
      checkIfAdmin,
      this.upload.single('file'),
      sanitizeRequestBody,
      this.uploadMedia.bind(this)
    )
    this.server.post(
      '/api/posts',
      checkIfAdmin,
      sanitizeRequestBody,
      mapTagsToArray,
      this.createPost.bind(this)
    )
    this.server.get(
      '/api/posts',
      checkIfAdmin,
      this.sendAllPosts.bind(this)
    )
    this.server.get(
      '/api/published_posts',
      this.sendPublishedPosts.bind(this)
    )
    this.server.get(
      '/api/posts/:id',
      this.sendOnePost.bind(this)
    )
    this.server.put(
      '/api/posts/:id',
      checkIfAdmin,
      sanitizeRequestBody,
      mapTagsToArray,
      this.updatePost.bind(this)
    )
    this.server.delete(
      '/api/posts/:id',
      checkIfAdmin,
      this.deletePost.bind(this)
    )
  }


  async renderPage(pageExtension, req, res, next) {

    let post
    try {
      post = await PostModel.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch (e) {
      post = await PostModel.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    if (post) {
      const queryParams = { id: req.params.id, post }
      const actualPage = `/posts/${pageExtension}`

      this.app.render(req, res, actualPage, queryParams)
    } else {
      next()
    }
  }


  async uploadMedia(req, res) {

    const uploadResponse = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto', angle: 0 })

    res.send(uploadResponse.secure_url)
  }


  async createPost(req, res) {

    let post = new PostModel(req.body)
    post.author = req.user
    post.slug = post.title.replace(/\s+/g, '-').toLowerCase()
    post = await post.save()

    // If a bulk-email post was published, send it
    const mailer = new Mailer()
    if (
      res.locals.settings.enableEmailingToUsers &&
      post.tags.includes(mailer.templateTag) &&
      post.tags.includes('bulk-email') &&
      post.published
    ) {
      await mailer.sendBulkEmail(post)
    }

    res.send(post)
  }


  async sendAllPosts(req, res) {

    const foundPosts = await PostModel.find().sort({ created: -1 }).lean()

    res.send(foundPosts)
  }


  async sendPublishedPosts(req, res) {

    const foundPosts = await PostModel.find({ published: true }).sort({ created: -1 }).lean()

    res.send(foundPosts)
  }


  async sendOnePost(req, res) {

    let foundPost
    try {
      foundPost = await PostModel.findById(req.params.id)
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    } catch(e) {
      foundPost = await PostModel.findOne({ slug: req.params.id })
        .populate('author')
        .populate('comments')
        .populate({ path: 'comments', populate: { path: 'author' } })
        .lean()
    }

    res.send(foundPost)
  }


  async updatePost(req, res) {

    const postDocument = { _id: req.params.id }
    req.body.slug = req.body.title.replace(/\s+/g, '-').toLowerCase()
    const updatedPost = await PostModel.findOneAndUpdate(postDocument, req.body)

    // If a bulk-email post was published, send it
    const mailer = new Mailer()
    const post = await PostModel.findOne(postDocument)
    if (
      res.locals.settings.enableEmailingToUsers &&
      post.tags.includes(mailer.templateTag) &&
      post.tags.includes('bulk-email') &&
      post.published
    ) {
      await mailer.sendBulkEmail(post)
    }

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
}


module.exports = PostController
