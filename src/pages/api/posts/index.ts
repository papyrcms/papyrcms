import { Database } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'
import Mailer from '@/utilities/mailer'

const getPosts = async (database: Database) => {
  const { findAll, Post } = database
  return await findAll(Post, {}, { sort: { created: -1 } })
}

const createPost = async (
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

  const { Post, create } = database

  const postData = {
    ...body,
    slug: body.title.replace(/\s+/g, '-').toLowerCase(),
  }
  const post = await create(Post, postData)

  // If a bulk-email post was published, send it
  const mailer = new Mailer(database)
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )
  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const posts = await getPosts(database)
    return await done(200, posts)
  }

  if (req.method === 'POST') {
    const post = await createPost(
      req.body,
      settings.enableEmailingToUsers,
      database
    )
    return await done(200, post)
  }

  return await done(404, { message: 'Page not found.' })
}
