import _ from 'lodash'
import serverContext from "@/serverContext"
import Mailer from "@/utilities/mailer"


const getPosts = async (database) => {
  const { findAll, Post } = database
  return await findAll(Post, {}, { sort: { created: -1 } })
}


const createPost = async (body, enableEmailingToUsers, database) => {
  if (body.tags) {
    const newTags = _.map(_.split(body.tags, ','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) return pendingTag
    })

    body.tags = [...new Set(newTags)]
  }

  const { Post, create } = database

  const postData = {
    ...body, slug: post.title.replace(/\s+/g, '-').toLowerCase()
  }
  const post = create(Post, postData)

  // If a bulk-email post was published, send it
  const mailer = new Mailer()
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


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const posts = await getPosts(database)
    return await done(200, posts)
  }


  if (req.method === 'POST') {
    const post = await createPost(req.body, settings.enableEmailingToUsers, database)
    return await done(200, post)
  }

  return await done(404, { message: 'Page not found.' })
}
