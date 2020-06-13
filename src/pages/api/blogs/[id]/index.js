import _ from 'lodash'
import serverContext from "@/serverContext"
import Blog from "@/models/blog"
import Comment from '@/models/comment'


const getBlog = async (id) => {
  let blog

  // Search for the blog by its id
  try {
    blog = await Blog.findById(id).populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } }).lean()
  } catch (err) {}

  // Then search by its slug
  if (!blog) {
    blog = await Blog.findOne({ slug: id }).populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } }).lean()
  }

  // Then search by something resembling its slug
  if (!blog) {
    blog = await Blog.findOne({ slug: new RegExp(id, 'i') }).populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } }).lean()
  }

  return blog
}


const updateBlog = async (id, body) => {
  const oldBlog = await Blog.findById(id)

  if (!oldBlog.published && body.published) {
    body.publishDate = Date.now()
  }

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await Blog.findOneAndUpdate({ _id: id }, body)
  return await Blog.findOne({ _id: id }).lean()
}


const deleteBlog = async (id) => {
  const blog = await Blog.findById(id)

  _.forEach(blog.comments, async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Blog.findByIdAndDelete(id)

  return 'blog deleted'
}



export default async (req, res) => {

  const { user, settings } = await serverContext(req, res)

  if ((!user || !user.isAdmin) && !settings.enableBlog) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blog = await getBlog(req.query.id)
    if ((!blog || !blog.published) && (!user || !user.isAdmin)) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    return res.status(200).send(blog)
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    const blog = await updateBlog(req.query.id, req.body)
    return res.status(200).send(blog)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    const message = await deleteBlog(req.query.id)
    return res.status(200).send(message)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
