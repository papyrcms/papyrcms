import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import _ from 'lodash'
import common from "../../../../middleware/common/"
import blogEnabled from "../../../../middleware/blogEnabled"
import Blog from "../../../../models/blog"
import Comment from '../../../../models/comment'


const handler = connect()
handler.use(common)
handler.use(blogEnabled)


const getBlog = async (id: string) => {
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


const updateBlog = async (id: string, body: any) => {
  const oldBlog = await Blog.findById(id)

  if (!oldBlog.published && body.published) {
    body.publishDate = Date.now()
  }

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await Blog.findOneAndUpdate({ _id: id }, body)
  return await Blog.findOne({ _id: id }).lean()
}


const deleteBlog = async (id: string) => {
  const blog = await Blog.findById(id)

  _.forEach(blog.comments, async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Blog.findByIdAndDelete(id)

  return 'blog deleted'
}


handler.get(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const blog = await getBlog(req.query.id as string)
  if (!blog || !blog.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.status(200).send(blog)
})


handler.put(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const blog = await updateBlog(req.query.id as string, req.body)
  return res.status(200).send(blog)
})


handler.delete(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteBlog(req.query.id as string)
  return res.status(200).send(message)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
