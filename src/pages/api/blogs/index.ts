import { Database } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getBlogs = async (database: Database) => {
  const { findAll, Blog } = database
  return await findAll(
    Blog,
    {},
    { sort: { publishDate: -1, created: -1 } }
  )
}

const createBlog = async (body: any, database: Database) => {
  const { create, Blog } = database
  const blogData = {
    ...body,
    slug: body.title.replace(/\s+/g, '-').toLowerCase(),
    tags: _.map(_.split(body.tags, ','), (tag) => tag.trim()),
  }

  if (body.published) {
    blogData.publishDate = Date.now()
  }

  return await create(Blog, blogData)
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
