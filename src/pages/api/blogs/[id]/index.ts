import { Database, Blog } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const getBlog = async (id: string, database: Database) => {
  let blog: Blog | undefined
  const { findOne, EntityType } = database

  // Search for the blog by its id
  try {
    blog = await findOne<Blog>(EntityType.Blog, { id })
  } catch (err: any) {}

  // Then search by its slug
  if (!blog) {
    blog = await findOne<Blog>(EntityType.Blog, { slug: id })
  }

  // Then search by something resembling its slug
  if (!blog) {
    blog = await findOne<Blog>(EntityType.Blog, {
      slug: new RegExp(id, 'i'),
    })
  }

  return blog
}

const updateBlog = async (
  id: string,
  body: any,
  database: Database
) => {
  const { findOne, save, EntityType } = database

  const oldBlog = await findOne<Blog>(EntityType.Blog, { id: id })
  if (!oldBlog) throw new Error('Blog not found')

  if (!oldBlog.isPublished && body.isPublished) {
    body.publishDate = new Date()
  }

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  body.tags = body.tags.split(',').map((tag: string) => tag.trim())

  return await save<Blog>(EntityType.Blog, { ...oldBlog, ...body })
}

const deleteBlog = async (id: string, database: Database) => {
  const { findOne, destroy, EntityType } = database

  const blog = await findOne<Blog>(EntityType.Blog, { id: id })
  if (!blog) throw new Error('Blog not found')
  await destroy(EntityType.Blog, blog)

  return 'blog deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (
    ((!user || !user.isAdmin) && !settings.enableBlog) ||
    typeof req.query.id !== 'string'
  ) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const blog = await getBlog(req.query.id, database)
    if ((!blog || !blog.isPublished) && (!user || !user.isAdmin)) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    return await done(200, blog)
  }

  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const blog = await updateBlog(req.query.id, req.body, database)
    return await done(200, blog)
  }

  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const message = await deleteBlog(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
