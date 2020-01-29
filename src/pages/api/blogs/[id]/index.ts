import connect from "next-connect"
import common from "../../../../middleware/common/"
import blogEnabled from "../../../../middleware/blogEnabled"
import Blog from "../../../../models/blog"
import Comment from '../../../../models/comment'


const handler = connect()
handler.use(common)
handler.use(blogEnabled)


const getBlog = async id => {
  let blog
  try {
    blog = await Blog.findById(id).populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } }).lean()
  } catch (err) {}

  if (!blog) {
    blog = await Blog.findOne({ slug: id }).populate('comments')
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


const deleteBlog = async id => {
  const blog = await Blog.findById(id)

  blog.comments.forEach(async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Blog.findByIdAndDelete(id)

  return 'blog deleted'
}


handler.get(async (req, res) => {
  const blog = await getBlog(req.query.id)
  if (!blog || !blog.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.send(blog)
})


handler.put(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const blog = await updateBlog(req.query.id, req.body)
  return res.send(blog)
})


handler.delete(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteBlog(req.query.id)
  return res.send(message)
})


export default handler
