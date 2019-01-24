const cloudinary = require( 'cloudinary' )
const multer = require( 'multer' )
const PostModel = require( '../models/post' )
const CommentModel = require( '../models/comment' )
const keys = require( '../config/keys' )

class PostRoutes {

  constructor( server, app, postType ) {

    this.server = server
    this.app = app
    this.postType = postType

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
    this.server.get( `/${this.postType}`, this.allowUserPosts.bind( this ), this.renderPage.bind( this, '_all' ) )
    this.server.get( `/${this.postType}/new`, this.allowUserPosts.bind( this ), this.renderPage.bind( this, '_create' ) )
    this.server.get( `/${this.postType}/:id`, this.renderPage.bind( this, '_show' ) )
    this.server.get( `/${this.postType}/:id/edit`, this.allowUserPosts.bind( this ), this.renderPage.bind( this, '_edit' ) )

    // Post API
    this.server.post( '/api/upload', this.allowUserPosts.bind( this ), this.upload.single( 'file' ), this.uploadMedia.bind( this ) )
    this.server.post( `/api/${this.postType}`, this.allowUserPosts.bind( this ), this.createPost.bind( this ) )
    this.server.get( `/api/${this.postType}`, this.sendAllPosts.bind( this ) )
    this.server.get( `/api/published_${this.postType}`, this.sendPublishedPosts.bind( this ) )
    this.server.get( `/api/${this.postType}/:id`, this.sendOnePost.bind( this ) )
    this.server.put( `/api/${this.postType}/:id`, this.allowUserPosts.bind( this ), this.updatePost.bind( this ) )
    this.server.delete( `/api/${this.postType}/:id`, this.allowUserPosts.bind( this ), this.deletePost.bind( this ) )

    // Comment API
    this.server.post( `/api/${this.postType}/:id/comments`, this.allowUserComments, this.createComment.bind( this ) )
    this.server.put( `/api/${this.postType}/:id/comments/:comment_id`, this.allowUserComments, this.updateComment.bind( this ) )
    this.server.delete( `/api/${this.postType}/:id/comments/:comment_id`, this.allowUserComments, this.deleteComment.bind( this ) )
  }


  allowUserPosts( req, res, next ) {

    const { settings, currentUser } = res.locals
    
    if ( settings.enableUserPosts || ( currentUser && currentUser.isAdmin ) ) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  allowUserComments( req, res, next ) {

    const { settings, currentUser } = res.locals

    if ( settings.enableCommenting || ( currentUser && currentUser.isAdmin ) ) {
      next()
    } else {
      res.status(401).send({ message: 'You are not allowed to do that' })
    }
  }


  renderPage( pageExtension, req, res ) {

    const actualPage = `/${this.postType}${pageExtension}`
    const id = !!req.params ? req.params.id : null
    const queryParams = { id }

    this.app.render( req, res, actualPage, queryParams )
  }


  async uploadMedia( req, res ) {

    const uploadResponse = await cloudinary.v2.uploader.upload( req.file.path, { resource_type: 'auto', angle: 0 } )

    res.send( uploadResponse.secure_url )
  }


  createPost( req, res ) {
console.log(req.body)
    const post = new PostModel( req.body )
    post.author = req.user
console.log(post)
    post.save()
    res.send( post )
  }


  async sendAllPosts( req, res ) {

    const foundPosts = await PostModel.find().sort({ created: -1 })

    res.send( foundPosts )
  }


  async sendPublishedPosts( req, res ) {

    const foundPosts = await PostModel.find({ published: true }).sort({ created: -1 })

    res.send( foundPosts )
  }


  async sendOnePost( req, res ) {

    const foundPost = await PostModel.findById( req.params.id )
      .populate( 'author' )
      .populate( 'comments' )
      .populate({ path: 'comments', populate: { path: 'author' } })

    res.send( foundPost )
  }


  async updatePost( req, res ) {

    const postDocument = { _id: req.params.id }
    const updatedPost = await PostModel.findOneAndUpdate( postDocument, req.body )

    res.send( updatedPost )
  }


  async deletePost( req, res ) {

    const post = await PostModel.findById( req.params.id )

    post.comments.forEach( async comment => {
      await CommentModel.findOneAndDelete({ _id: comment })
    })

    post.deleteOne()

    res.send( 'post deleted' )
  }


  async createComment( req, res ) {

    const { body, user, params } = req
    const comment = new CommentModel({
      content: body.content,
      author: user
    })
    const post = await PostModel.findById( params.id )

    comment.save()
    post.comments.push( comment )
    post.save()
    res.send( comment )
  }


  async updateComment( req, res ) {

    const commentDocument = { _id: req.params.comment_id }
    const updatedComment = await CommentModel.findOneAndUpdate( commentDocument, req.body )

    res.send( updatedComment )
  }


  async deleteComment( req, res ) {

    const post = await PostModel.findById( req.params.id )

    post.comments.forEach( ( comment, i ) => {
      if ( req.params.comment_id === comment._id.toString() ) {
        post.comments.splice( i, 1 )
      }
    })
    post.save()

    await CommentModel.findOneAndDelete({ _id: req.params.comment_id })

    res.send( req.params.comment_id )
  }
}


module.exports = PostRoutes
