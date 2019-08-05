const Controller = require('./abstractController')
const cloudinary = require('cloudinary')
const multer = require('multer')
const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const keys = require('../config/keys')
const { checkIfAdmin, mapTagsToArray, sanitizeRequestBody } = require('../utilities/middleware')

class PostRoutes extends Controller {

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
      '/posts', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_all')
    )
    this.server.get(
      '/posts/new', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_create')
    )
    this.server.get(
      '/posts/:id', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_show')
    )
    this.server.get(
      '/posts/:id/edit', 
      checkIfAdmin, 
      this.renderPage.bind(this, '_edit')
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

    console.log(req.body)

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
}


module.exports = PostRoutes
