import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import common from '../../../middleware/common/'
import blogEnabled from '../../../middleware/blogEnabled'
import Blog from '../../../models/blog'


const handler = connect()
handler.use(common)
handler.use(blogEnabled)


handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const blogs = await Blog.find({ published: true })
    .sort({ publishDate: -1 }).lean()
  return res.status(200).send(blogs)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
