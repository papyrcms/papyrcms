import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Blog } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if ((!user || !user.isAdmin) && !settings.enableBlog) {
    return done(403, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'GET') {
    const { findAll, EntityType } = database
    const blogs = await findAll<Blog>(EntityType.Blog, {
      isPublished: true,
    })
    blogs.sort((a, b) => {
      if (a.publishedAt && b.publishedAt)
        return a.publishedAt > b.publishedAt ? -1 : 1
      if (a.publishedAt) return -1
      if (b.publishedAt) return 1
      return (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
    })

    return done(200, blogs)
  }

  return done(404, { message: 'Page not found' })
}
