import Controller from './abstractController'
import Comment from '../models/comment'
import { sanitizeRequestBody } from '../utilities/middleware'
import { configureSettings } from '../utilities/functions'


class CommentController extends Controller {

  registerSettings() {

    // Middleware to configure comment settings
    this.server.use(async (req, res, next) => {

      const defaultSettings = { enableCommenting: false }
      const settings = await configureSettings('comment', defaultSettings)

      Object.keys(settings).forEach(optionKey => {
        const optionValue = settings[optionKey]

        res.locals.settings[optionKey] = optionValue
      })
      next()
    })
  }


  registerRoutes() {

    // Comment API
    this.server.post(
      '/api/:postType/:id/comments',
      this.allowUserComments,
      sanitizeRequestBody,
      this.createComment.bind(this)
    )
    this.server.put(
      '/api/:postType/:id/comments/:comment_id',
      this.allowUserComments,
      sanitizeRequestBody,
      this.updateComment.bind(this)
    )
    this.server.delete(
      '/api/:postType/:id/comments/:comment_id',
      this.allowUserComments,
      this.deleteComment.bind(this)
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


  getPostModel(postType) {
    
    switch (postType) {
      case 'blog':
        return require('../models/blog')
      default :
        return require('../models/blog')
    }
  }


  async createComment(req, res) {

    const { body, user, params } = req
    const comment = new Comment({
      content: body.content,
      author: user
    })

    const PostModel = this.getPostModel(params.postType)
    const post = await PostModel.findById(params.id)

    comment.save()
    post.comments.push(comment)
    post.save()
    res.send(comment)
  }


  async updateComment(req, res) {

    const commentDocument = { _id: req.params.comment_id }
    const updatedComment = await Comment.findOneAndUpdate(commentDocument, req.body)

    res.send(updatedComment)
  }


  async deleteComment(req, res) {

    const { id, postType, comment_id } = req.params

    const PostModel = this.getPostModel(postType)
    const post = await PostModel.findById(id)

    post.comments.forEach((comment, i) => {
      if (comment_id === comment._id.toString()) {
        post.comments.splice(i, 1)
      }
    })
    post.save()

    await Comment.findOneAndDelete({ _id: comment_id })

    res.send(comment_id)
  }
}


export default CommentController
