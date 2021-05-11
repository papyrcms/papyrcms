import { Database, Comment } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const deleteComment = async (
  commentId: string,
  database: Database
) => {
  const { destroy, findOne, EntityType } = database
  const comment = await findOne<Comment>(EntityType.Comment, {
    id: commentId,
  })
  if (!comment) throw new Error('Comment not found')
  await destroy(EntityType.Comment, comment)

  return 'comment deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (
    typeof req.query.id !== 'string' ||
    typeof req.query.commentId !== 'string'
  ) {
    return await done(500, {
      message: 'id was not a string',
    })
  }

  if (
    (!user || !user.isAdmin) &&
    (!settings.enableBlog || !settings.enableCommenting)
  ) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'PUT') {
    const { EntityType, findOne, save } = database

    let comment = await findOne<Comment>(EntityType.Comment, {
      id: req.query.commentId,
    })
    if (!comment) throw new Error('Comment not found')

    if (!user || (comment.author.id !== user.id && !user.isAdmin)) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }

    comment.content = req.body.content
    comment = await save(EntityType.Comment, comment)

    return await done(200, comment)
  }

  if (req.method === 'DELETE') {
    const { EntityType, findOne } = database

    let comment = await findOne<Comment>(EntityType.Comment, {
      id: req.query.commentId,
    })
    if (!comment) throw new Error('Comment not found')

    if (!user || (comment.author.id !== user.id && !user.isAdmin)) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }

    const message = await deleteComment(req.query.commentId, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
