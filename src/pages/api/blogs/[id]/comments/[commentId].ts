import { Database } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const deleteComment = async (
  blogId: string,
  commentId: string,
  database: Database
) => {
  const { destroy, Comment, findOne, update, Blog } = database
  const blog = await findOne(Blog, { id: blogId })

  blog.comments = _.filter(blog.comments, (foundComment, i) => {
    return foundComment.id !== commentId
  })
  await update(Blog, { id: blogId }, { comments: blog.comments })
  await destroy(Comment, { id: commentId })

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
    const { Comment, findOne, update } = database

    let comment = await findOne(Comment, { id: req.query.commentId })

    // @ts-ignore not sure what it thinks is going on here
    if (!user || !comment.author.id == user.id || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }

    await update(
      Comment,
      { id: req.query.commentId },
      { content: req.body.content }
    )
    comment = await findOne(
      Comment,
      { id: req.query.commentId },
      { include: ['author'] }
    )

    return await done(200, comment)
  }

  if (req.method === 'DELETE') {
    const { Comment, findOne, update } = database

    let comment = await findOne(Comment, { id: req.query.commentId })

    // @ts-ignore not sure what it thinks is going on here
    if (!user || !comment.author.id == user.id || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }

    const message = await deleteComment(
      req.query.id,
      req.query.commentId,
      database
    )
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
