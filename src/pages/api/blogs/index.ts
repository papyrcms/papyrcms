import { Database, Blog } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getBlogs = async (database: Database) => {
  const { findAll, EntityType } = database
  const blogs = await findAll<Blog>(EntityType.Blog)
  blogs.sort((a, b) => {
    if (a.publishedAt && b.publishedAt)
      return a.publishedAt > b.publishedAt ? -1 : 1
    if (a.publishedAt) return -1
    if (b.publishedAt) return 1
    return (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
  })
  return blogs
}

const createBlog = async (body: any, database: Database) => {
  const { save, EntityType } = database
  const blogData = {
    ...body,
    slug: body.title.replace(/\s+/g, '-').toLowerCase(),
    tags: _.map(_.split(body.tags, ','), (tag) => tag.trim()),
  }

  if (body.isPublished) {
    blogData.publishedAt = new Date()
  }

  return await save(EntityType.Blog, blogData)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const blogs = await getBlogs(database)
    return await done(200, blogs)
  }

  if (req.method === 'POST') {
    const blog = await createBlog(req.body, database)
    return await done(200, blog)
  }

  return await done(404, { message: 'Page not found' })
}
