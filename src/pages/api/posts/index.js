import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import Post from "../../../models/post"
import Mailer from "../../../utilities/mailer"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


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


handler.get(async (req, res) => {
  const posts = await getPosts()
  return res.send(posts)
})


handler.post(async (req, res) => {
  const post = await createPost(req.body, res.locals.settings.enableEmailingToUsers)
  return res.send(post)
})


export default handler
