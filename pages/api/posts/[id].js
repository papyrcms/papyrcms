import mongoose from 'mongoose'
const { post: Post, comment: Comment } = mongoose.models


const getPost = async id => {
  let post
  try {
    post = await Post.findById(id)
      .populate("comments")
      .populate({ path: "comments", populate: { path: "author" } })
      .lean()
  } catch (err) {
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


export default async (req, res) => {
  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getPost(req.query.id)
        return res.send(response)
      case 'PUT':
        if (!req.user || !req.user.isAdmin) {
          throw Error('You are not allowed to do that.')
        }
        response = await updatePost(req.query.id, req.body, res.locals.settings.enableEmailingToUsers)
        return res.send(response)
      case 'DELETE':
        if (!req.user || !req.user.isAdmin) {
          throw Error('You are not allowed to do that.')
        }
        response = await deletePost(req.query.id)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(401).send({ message: err.message })
  }
}
