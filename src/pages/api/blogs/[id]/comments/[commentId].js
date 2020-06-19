import _ from 'lodash'
import serverContext from "@/serverContext"
import Blog from "@/models/blog"
import Comment from "@/models/comment"


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

  const { user, settings, done } = await serverContext(req, res)

  if (
    (!user || !user.isAdmin) && (
      !settings.enableBlog ||
      !settings.enableCommenting
    )
  ) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    let comment = await Comment.findById(req.query.commentId).populate("author")
    if (
      !comment.author._id.equals(user._id) ||
      !user.isAdmin
    ) {
      return await done(403, { message: "You are not allowed to do that." })
    }

    comment = await updateComment(comment, req.body.content)
    return await done(200, comment)
  }


  if (req.method === 'DELETE') {
    const comment = await Comment.findById(req.query.commentId).populate("author")
    if (
      !comment.author._id.equals(user._id) ||
      !user.isAdmin
    ) {
      return await done(403, { message: "You are not allowed to do that." })
    }

    const message = await deleteComment(req.query.id, comment)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}