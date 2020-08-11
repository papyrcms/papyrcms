import serverContext from "@/serverContext"


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

  if (req.method === 'POST') {

    const { findOne, create, update, Blog, Comment } = database
    const commentData = {
      content: req.body.content,
      author: user
    }
    const comment = await create(Comment, commentData)

    const blog = await findOne(Blog, { _id: req.query.id }, { include: ['comments'] })
    const newComments = [...blog.comments, comment]
    await update(Blog, { _id: req.query.id }, { comments: newComments })

    return await done(200, comment)
  }

  return await done(404, { message: 'Page not found.' })
}
