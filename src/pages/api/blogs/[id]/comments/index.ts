import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Comment } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (
    (!user || !user.isAdmin) &&
    (!settings.enableBlog || !settings.enableCommenting)
  ) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'POST') {
    const { save, EntityType } = database
    const commentData = {
      content: req.body.content,
      author: user,
      blogId: req.query.id,
    } as Comment

    const comment = await save<Comment>(
      EntityType.Comment,
      commentData
    )

    return await done(200, comment)
  }

  return await done(404, { message: 'Page not found.' })
}
