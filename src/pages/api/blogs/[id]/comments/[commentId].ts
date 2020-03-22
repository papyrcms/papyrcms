import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import _ from 'lodash'
import common from "../../../../../middleware/common/"
import blogEnabled from "../../../../../middleware/blogEnabled"
import userCommentsEnabled from "../../../../../middleware/userCommentsEnabled"
import Blog from "../../../../../models/blog"
import Comment from "../../../../../models/comment"


const handler = connect()
handler.use(common)
handler.use(blogEnabled)
handler.use(userCommentsEnabled)


const updateComment = async (comment: comment, newContent: string) => {
  comment.content = newContent
  // @ts-ignore .save() exists on the mongoose model
  await comment.save()

  return comment
}


const deleteComment = async (blogId: string, comment: comment) => {
  const blog = await Blog.findById(blogId)
  _.forEach(blog.comments, (foundComment, i) => {
    // @ts-ignore .equals() exists on the mongoose oid
    if (comment._id.equals(foundComment._id)) {
      blog.comments.splice(i, 1)
    }
  })
  blog.save()

  await Comment.findOneAndDelete({ _id: comment._id })
  return 'comment deleted'
}


handler.put(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  let comment = await Comment.findById(req.query.commentId).populate("author")
  if (
    !comment.author._id.equals(req.user._id) ||
    !req.user.isAdmin
  ) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  comment = await updateComment(comment, req.body.content)
  return res.status(200).send(comment)
})


handler.delete(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const comment = await Comment.findById(req.query.commentId).populate("author")
  if (
    !comment.author._id.equals(req.user._id) ||
    !req.user.isAdmin
  ) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  const message = await deleteComment(req.query.id as string, comment)
  return res.status(200).send(message)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
