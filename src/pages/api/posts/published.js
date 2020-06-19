import serverContext from '@/serverContext'
import Post from '@/models/post'


export default async (req, res) => {

  const { done } = await serverContext(req, res)

  if (req.method === 'GET') {
    const posts = await Post.find({ published: true }).sort({ created: -1 }).lean()
    return await done(200, posts)
  }

  return await done(404, { message: 'Page not found.' })
}
