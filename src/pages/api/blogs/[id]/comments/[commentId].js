import _ from 'lodash'
import common from "../../../../../utilities/serverContext/"
import Blog from "../../../../../models/blog"
import Comment from "../../../../../models/comment"


const updateComment = async (comment, newContent) => {
  comment.content = newContent

  await comment.save()

  return comment
}


const deleteComment = async (blogId, comment) => {
  const blog = await Blog.findById(blogId)
  _.forEach(blog.comments, (foundComment, i) => {

    if (comment._id.equals(foundComment._id)) {
      blog.comments.splice(i, 1)
    }
  })
  blog.save()

  await Comment.findOneAndDelete({ _id: comment._id })
  return 'comment deleted'
}


export default async (req, res) => {

  const { user, settings } = await common(req, res)

  if (
    (!user || !user.isAdmin) && (
      !settings.enableBlog ||
      !settings.enableCommenting
    )
  ) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    let comment = await Comment.findById(req.query.commentId).populate("author")
    if (
      !comment.author._id.equals(user._id) ||
      !user.isAdmin
    ) {
      return res.status(403).send({ message: "You are not allowed to do that." })
    }

    comment = await updateComment(comment, req.body.content)
    return res.status(200).send(comment)
  }


  if (req.method === 'DELETE') {
    const comment = await Comment.findById(req.query.commentId).populate("author")
    if (
      !comment.author._id.equals(user._id) ||
      !user.isAdmin
    ) {
      return res.status(403).send({ message: "You are not allowed to do that." })
    }

    const message = await deleteComment(req.query.id, comment)
    return res.status(200).send(message)
  }

  return res.status(404).send({ message: 'Page not found.' })
}