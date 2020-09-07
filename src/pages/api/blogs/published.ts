import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if ((!user || !user.isAdmin) && !settings.enableBlog) {
    return done(403, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'GET') {
    const { findAll, Blog } = database
    const blogs = await findAll(
      Blog,
      { published: true },
      { sort: { publishDate: -1, created: -1 } }
    )
    return done(200, blogs)
  }

  return done(404, { message: 'Page not found' })
}
