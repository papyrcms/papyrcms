import mongoose from 'mongoose'
import Mailer from '../../../utilities/mailer'
const { post: Post } = mongoose.models


const getPosts = async () => {
  return await Post.find().sort({ created: -1 }).lean()
}


const createPost = async (body, enableEmailingToUsers) => {
  if (body.tags) {
    const newTags = body.tags.split(',').map(tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) return pendingTag
    })

    body.tags = [...new Set(newTags)]
  }

  let post = new Post(body)
  post.slug = post.title.replace(/\s+/g, '-').toLowerCase()
  post = await post.save()

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
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
  }

  switch (req.method) {
    case 'GET':
      const posts = await getPosts()
      return res.send(posts)
    case 'POST':
      const newPost = await createPost(req.body, res.locals.settings.enableEmailingToUsers)
      return res.send(newPost)
    default:
      return res.status(404).send({ message: 'Endpoint not found.' })
  }
}
