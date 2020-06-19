import serverContext from '@/serverContext'
import Blog from '@/models/blog'


export default async (req, res) => {

  const { user, settings, done } = await serverContext(req, res)

  if ((!user || !user.isAdmin) && !settings.enableBlog) {
    return done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blogs = await Blog.find({ published: true })
      .sort({ publishDate: -1 }).lean()
    return done(200, blogs)
  }

  return done(404, { message: "Page not found" })
}
