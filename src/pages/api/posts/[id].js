import connect from "next-connect"
import common from "../../../middleware/common"
import Post from "../../../models/post"


const handler = connect()
handler.use(common)


const getPost = async id => {
  let post
  try {
    post = await Post.findById(id)
      .populate("comments")
      .populate({ path: "comments", populate: { path: "author" } })
      .lean()
  } catch (err) {}

  if (!post) {
    post = await Post.findOne({ slug: id })
      .populate("comments")
      .populate({ path: "comments", populate: { path: "author" } })
      .lean()
  }
  return post
}


const updatePost = async (id, body, enableEmailingToUsers) => {
  const postDocument = { _id: id }
  body.slug = body.title.replace(/\s+/g, "-").toLowerCase()
  const updatedPost = await Post.findOneAndUpdate(postDocument, body)

  // If a bulk-email post was published, send it
  const mailer = new Mailer()
  const post = await Post.findOne(postDocument)
  if (
    enableEmailingToUsers &&
    post.tags.includes(mailer.templateTag) &&
    post.tags.includes("bulk-email") &&
    post.published
  ) {
    await mailer.sendBulkEmail(post)
  }

  return updatedPost
}


const deletePost = async id => {
  const post = await Post.findById(id)

  post.comments.forEach(async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Post.findByIdAndDelete(id)

  return "post deleted"
}


handler.get(async (req, res) => {
  const post = await getPost(req.query.id)
  if (!post.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.send(post)
})


handler.put(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const post = await updatePost(req.query.id, req.body, res.locals.settings.enableEmailingToUsers)
  return res.send(post)
})


handler.delete(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deletePost(req.query.id)
  return res.send(message)
})


export default handler
