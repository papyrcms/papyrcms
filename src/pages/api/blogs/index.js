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

  const { user } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blogs = await getBlogs()
    return res.status(200).send(blogs)
  }
  
  
  if (req.method === 'POST') {
    const blog = await createBlog(req.body)
    return res.status(200).send(blog)
  }

  return res.status(404).send({ message: 'Page not found' })
}
