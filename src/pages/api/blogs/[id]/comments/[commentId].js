import _ from 'lodash'
import serverContext from "@/serverContext"


const deleteComment = async (blogId, commentId, database) => {

  const { destroy, Comment, findOne, update, Blog } = database
  const blog = await findOne({ _id: blogId })
  _.forEach(blog.comments, (foundComment, i) => {
    if (foundComment._id == commentId) {
      blog.comments.splice(i, 1)
    }
  })
  await update(Blog, { _id: blogId }, { comments: blog.comments })

  await destroy(Comment, { _id: commentId })

  return 'comment deleted'
}


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)

  if (
    (!user || !user.isAdmin) && (
      !settings.enableBlog ||
      !settings.enableCommenting
    )
  ) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    const { Comment, findOne, update } = database
  
    let comment = await findOne(Comment, { _id: req.query.commentId })

    if (
      !comment.author == user._id ||
      !user.isAdmin
    ) {
      return await done(403, { message: "You are not allowed to do that." })
    }

    await update(Comment, { _id: req.query.commentId }, { content: req.body.content })
    comment = await findOne(Comment, { _id: req.query.commentId }, { include: ['author'] })

    return await done(200, comment)
  }


  if (req.method === 'DELETE') {
    let comment = await findOne(Comment, { _id: req.query.commentId })

    if (
      !comment.author == user._id ||
      !user.isAdmin
    ) {
      return await done(403, { message: "You are not allowed to do that." })
    }

    const message = await deleteComment(req.query.id, req.query.commentId, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}