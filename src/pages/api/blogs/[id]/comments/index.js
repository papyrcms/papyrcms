import serverContext from "@/serverContext"
import Blog from "@/models/blog"
import Comment from "@/models/comment"


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

  if (req.method === 'POST') {
    const comment = new Comment({
      content: req.body.content,
      author: user
    })
    const blog = await Blog.findById(req.query.id)

    comment.save()
    blog.comments.push(comment)
    blog.save()
    return await done(200, comment)
  }

  return await done(404, { message: 'Page not found.' })
}
