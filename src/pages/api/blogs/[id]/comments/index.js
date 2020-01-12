import mongoose from 'mongoose'
const { blog: Blog, comment: Comment } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (
    (!req.user || !req.user.isAdmin) && (
      !res.locals.settings.enableUserComments ||
      !res.locals.settings.enableBlog
    )
  ) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    const comment = new Comment({
      content: req.body.content,
      author: req.user
    })
    const blog = await Blog.findById(req.query.id)

    comment.save()
    blog.comments.push(comment)
    blog.save()
    return res.send(comment)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}