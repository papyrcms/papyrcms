import _ from 'lodash'
import serverContext from "../../../utilities/serverContext/"
import Post from "../../../models/post"
import Mailer from "../../../utilities/mailer"


const getPosts = async () => {
  return await Post.find().sort({ created: -1 }).lean()
}


const createPost = async (body, enableEmailingToUsers) => {
  if (body.tags) {
    const newTags = _.map(_.split(body.tags, ','), tag => {
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

  const { user } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const posts = await getPosts()
    return res.status(200).send(posts)
  }


  if (req.method === 'POST') {
    const post = await createPost(req.body, res.locals.settings.enableEmailingToUsers)
    return res.status(200).send(post)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
