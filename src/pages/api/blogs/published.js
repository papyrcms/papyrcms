import common from '../../../utilities/serverContext/'
import Blog from '../../../models/blog'


export default async (req, res) => {

  const { user, settings } = await common(req, res)

  if ((!user || !user.isAdmin) && settings.enableBlog) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blogs = await Blog.find({ published: true })
      .sort({ publishDate: -1 }).lean()
    return res.status(200).send(blogs)
  }

  return res.status(404).send({ message: "Page not found" })
}
