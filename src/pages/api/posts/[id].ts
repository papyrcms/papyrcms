import { Database, Post } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'
import Mailer from '@/utilities/mailer'

const getPost = async (id: string, database: Database) => {
  let post: Post | undefined
  const { EntityType, findOne } = database

  try {
    post = await findOne<Post>(EntityType.Post, { id })
  } catch (err) {}

  if (!post) {
    post = await findOne<Post>(EntityType.Post, { slug: id })
  }

  if (!post) {
    post = await findOne<Post>(EntityType.Post, {
      slug: new RegExp(id, 'i'),
    })
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
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  const { save, findOne, EntityType } = database
  const post = await findOne<Post>(EntityType.Post, { id })
  const updated = await save<Post>(EntityType.Post, {
    ...post,
    ...body,
  })
  if (!updated) throw new Error('Post not updated')

  // If a bulk-email post was published, send it
  const mailer = new Mailer(database)
  if (
    enableEmailingToUsers &&
    updated.tags.includes(mailer.templateTag) &&
    updated.tags.includes('bulk-email') &&
    updated.isPublished
  ) {
    await mailer.sendBulkEmail(updated)
  }

  return post
}

const deletePost = async (id: string, database: Database) => {
  const { EntityType, findOne, destroy } = database
  const post = await findOne(EntityType.Post, { id })
  if (!post) throw new Error('Post not found')

  await destroy(EntityType.Post, post)

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
    if ((!post || !post.isPublished) && (!user || !user.isAdmin)) {
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
