import mongoose from 'mongoose'
const { blog: Blog } = mongoose.models


const getBlogs = async () => {
  return await Blog.find().sort({ publishDate: -1, created: -1 }).lean()
}


const createBlog = async body => {
  const blog = new Blog(body)
  blog.slug = blog.title.replace(/\s+/g, '-').toLowerCase()

  if (blog.published) {
    blog.publishDate = Date.now()
  }

  blog.save()
  return blog
}


export default async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getBlogs()
        return res.send(response)
      case 'POST':
        response = await createBlog(req.body)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
