import mongoose from 'mongoose'
const { blog: Blog, comment: Comment } = mongoose.models


const updateComment = async (comment, newContent) => {

  comment.content = newContent
  await comment.save()

  return comment
}


const deleteComment = async (blogId, comment) => {

  const blog = await Blog.findById(blogId)
  blog.comments.forEach((foundComment, i) => {
    if (comment._id.equals(foundComment._id)) {
      blog.comments.splice(i, 1)
    }
  })
  blog.save()

  await Comment.findOneAndDelete({ _id: comment._id })

  return 'comment deleted'
}


export default async (req, res) => {
  if (
    (!req.user || !req.user.isAdmin) && (
      !res.locals.settings.enableUserComments ||
      !res.locals.settings.enableBlog
    )
  ) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  const comment = await Comment.findById(req.query.commentId).populate('author')
  if (!comment.author._id.equals(req.user._id) || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  let response
  switch (req.method) {
    case 'PUT':
      response = await updateComment(comment, req.body.content)
      return res.send(response)
    case 'DELETE':
      response = await deleteComment(req.query.id, comment)
      return res.send(response)
    default:
      return res.status(404).send({ message: 'Endpoint not found.' })
  }
}