import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Post } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { database, done } = await serverContext(req, res)

  if (req.method === 'GET') {
    const { EntityType, findAll } = database
    const posts = await findAll<Post>(EntityType.Post, {
      isPublished: true,
    })
    posts.sort((a, b) =>
      (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
    )
    return await done(200, posts)
  }

  return await done(404, { message: 'Page not found.' })
}
