import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import Blog from "../../../models/blog"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


const getBlogs = async () => {
  return await Blog.find().sort({ publishDate: -1, created: -1 }).lean()
}


const createBlog = async (body: any) => {
  const blog = new Blog(body)
  blog.slug = blog.title.replace(/\s+/g, '-').toLowerCase()

  if (blog.published) {
    blog.publishDate = Date.now()
  }

  blog.save()
  return blog
}


handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const blogs = await getBlogs()
  return res.status(200).send(blogs)
})


handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const blog = await createBlog(req.body)
  return res.status(200).send(blog)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
