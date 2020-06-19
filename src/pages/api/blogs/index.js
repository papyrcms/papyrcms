import serverContext from "@/serverContext"
import Blog from "@/models/blog"


const getBlogs = async () => {
  return await Blog.find().sort({ publishDate: -1, created: -1 }).lean()
}


const createBlog = async (body) => {
  const blog = new Blog(body)
  blog.slug = blog.title.replace(/\s+/g, '-').toLowerCase()

  if (blog.published) {
    blog.publishDate = Date.now()
  }

  blog.save()
  return blog
}


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blogs = await getBlogs()
    return await done(200, blogs)
  }
  
  
  if (req.method === 'POST') {
    const blog = await createBlog(req.body)
    return await done(200, blog)
  }

  return await done(404, { message: 'Page not found' })
}
