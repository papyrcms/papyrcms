import connect from "next-connect"
import common from "../../../../../middleware/common/"
import blogEnabled from "../../../../../middleware/blogEnabled"
import userCommentsEnabled from "../../../../../middleware/userCommentsEnabled"
import Blog from "../../../../../models/blog"
import Comment from "../../../../../models/comment"


const handler = connect()
handler.use(common)
handler.use(blogEnabled)
handler.use(userCommentsEnabled)


handler.post(async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    author: req.user
  })
  const blog = await Blog.findById(req.query.id)

  comment.save()
  blog.comments.push(comment)
  blog.save()
  return res.status(200).send(comment)
})


export default (req, res) => handler.apply(req, res)
