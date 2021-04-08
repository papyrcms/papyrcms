import { Database, Post } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'
import Mailer from '@/utilities/mailer'

const getPost = async (id: string, database: Database) => {
  let post: Post | undefined
  const { Post, findOne } = database

  try {
    post = await findOne(Post, { _id: id }, { include: ['comments'] })
  } catch (err) {}

  if (!post) {
    post = await findOne(
      Post,
      { slug: id },
      { include: ['comments'] }
    )
  }

  if (!post) {
    post = await findOne(
      Post,
      { slug: new RegExp(id, 'i') },
      { include: ['comments'] }
    )
  }

  return post
}

const updatePost = async (
  id: string,
  body: any,
  enableEmailingToUsers: boolean,
  database: Database
) => {
  if (body.tags) {
    let newTags = _.map(_.split(body.tags, ','), (tag) => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) return pendingTag
    })
    newTags = _.filter(newTags, (tag) => !!tag)
    body.tags = _.uniq(newTags)
  }
  const postDocument = { _id: id }
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  const { update, findOne, Post } = database
  await update(Post, postDocument, body)

  // If a bulk-email post was published, send it
  const mailer = new Mailer(database)
  const post = await findOne(Post, postDocument)
  if (
    enableEmailingToUsers &&
    post.tags.includes(mailer.templateTag) &&
    post.tags.includes('bulk-email') &&
    post.published
  ) {
    await mailer.sendBulkEmail(post)
  }

  return post
}

const deletePost = async (id: string, database: Database) => {
  const { Post, Comment, findOne, destroy } = database

  const post = await findOne(Post, { _id: id })

  _.forEach(post.comments, async (comment) => {
    await destroy(Comment, { _id: comment })
  })

  await destroy(Post, { _id: id })

  return 'post deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (typeof req.query.id !== 'string') {
    return await done(500, { message: 'id was not a string' })
  }

  if (req.method === 'GET') {
    const post = await getPost(req.query.id, database)
    if ((!post || !post.published) && (!user || !user.isAdmin)) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    return await done(200, post)
  }

  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const post = await updatePost(
      req.query.id,
      req.body,
      settings.enableEmailingToUsers,
      database
    )
    return await done(200, post)
  }

  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const message = await deletePost(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
