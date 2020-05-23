import serverContext from "../../../../../utilities/serverContext/"
import Blog from "../../../../../models/blog"
import Comment from "../../../../../models/comment"


export default async (req, res) => {

  const { user, settings } = await serverContext(req, res)

  if (
    (!user || !user.isAdmin) && (
      !settings.enableBlog ||
      !settings.enableCommenting
    )
  ) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'POST') {
    const comment = new Comment({
      content: req.body.content,
      author: user
    })
    const blog = await Blog.findById(req.query.id)

    comment.save()
    blog.comments.push(comment)
    blog.save()
    return res.status(200).send(comment)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
