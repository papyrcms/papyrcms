import mongoose from 'mongoose'
const { blog: Blog, comment: Comment } = mongoose.models


const getBlog = async id => {
  let blog
  try {
    blog = await Blog.findById(id)
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })
      .lean()
  } catch (err) {}

  if (!blog) {
    blog = await Blog.findOne({ slug: id })
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })
      .lean()
  }
  return blog
}


const updateBlog = async (id, body) => {
  const oldBlog = await Blog.findById(id)

  if (!oldBlog.published && body.published) {
    body.publishDate = Date.now()
  }

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, body)

  return updatedBlog
}


const deleteBlog = async id => {
  const blog = await Blog.findById(id)

  blog.comments.forEach(async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Blog.findByIdAndDelete(id)

  return 'blog deleted'
}


export default async (req, res) => {
  if (!res.locals.settings.enableBlog && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getBlog(req.query.id)
        if (!response.published && (!req.user || !req.user.isAdmin)) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        return res.send(response)
      case 'PUT':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await updateBlog(req.query.id, req.body)
        return res.send(response)
      case 'DELETE':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await deleteBlog(req.query.id)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}