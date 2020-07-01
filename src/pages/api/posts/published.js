import serverContext from '@/serverContext'


export default async (req, res) => {

  const { database, done } = await serverContext(req, res)

  if (req.method === 'GET') {
    const { Post, findAll } = database
    const posts = await findAll(Post, { published: true }, { sort: { created: -1 } })
    return await done(200, posts)
  }

  return await done(404, { message: 'Page not found.' })
}
