import _ from 'lodash'
import serverContext from "@/serverContext"


const getBlog = async (id, database) => {
  let blog
  const { findOne, Blog } = database

  // Search for the blog by its id
  try {
    blog = await findOne(Blog, { _id: id }, { include: ['comments'] })
  } catch (err) {}

  // Then search by its slug
  if (!blog) {
    blog = await findOne(Blog, { slug: id }, { include: ['comments'] })
  }

  // Then search by something resembling its slug
  if (!blog) {
    blog = await findOne(Blog, { slug: new RegExp(id, 'i') }, { include: ['comments'] })
  }

  return blog
}


const updateBlog = async (id, body, database) => {

  const { findOne, update, Blog } = database

  const oldBlog = await findOne(Blog, { _id: id })

  if (!oldBlog.published && body.published) {
    body.publishDate = Date.now()
  }

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await update(Blog, { _id: id }, body)
  return await findOne(Blog, { _id: id })
}


const deleteBlog = async (id, database) => {

  const { findOne, destroy, Blog, Comment } = database

  const blog = await findOne(Blog, { _id: id })

  _.forEach(blog.comments, async comment => {
    await destroy(Comment, { _id: comment })
  })

  await destroy(Blog, { _id: id })

  return 'blog deleted'
}



export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)

  if ((!user || !user.isAdmin) && !settings.enableBlog) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const blog = await getBlog(req.query.id, database)
    if ((!blog || !blog.published) && (!user || !user.isAdmin)) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    return await done(200, blog)
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const blog = await updateBlog(req.query.id, req.body, database)
    return await done(200, blog)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const message = await deleteBlog(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
