import mongoose from 'mongoose'
const { blog: Blog } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).send({ message: 'Endpoint not found' })
  }

  if (!res.locals.settings.enableBlog && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    const blogs = await Blog.find({ published: true })
      .sort({ publishDate: -1 })
      .lean()
    return res.send(blogs)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}