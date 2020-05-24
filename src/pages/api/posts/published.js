import serverContext from '@/serverContext'
import Post from '@/models/post'


export default async (req, res) => {

  await serverContext(req, res)

  if (req.method === 'GET') {
    const posts = await Post.find({ published: true }).sort({ created: -1 }).lean()
    return res.status(200).send(posts)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
