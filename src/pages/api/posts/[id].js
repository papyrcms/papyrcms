import _ from 'lodash'
import serverContext from "@/serverContext"
import Post from "@/models/post"
import Comment from "@/models/comment"
import Mailer from "@/utilities/mailer"


const getPost = async (id) => {
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

  if (!post) {
    post = await Post.findOne({ slug: new RegExp(id, 'i') })
      .populate("comments")
      .populate({ path: "comments", populate: { path: "author" } })
      .lean()
  }

  return post
}


const updatePost = async (id, body, enableEmailingToUsers) => {
  if (body.tags) {
    const newTags = _.map(_.split(body.tags, ','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()

      if (!!pendingTag) return pendingTag
    })

    body.tags = [...new Set(newTags)]
  }
  const postDocument = { _id: id }
  body.slug = body.title.replace(/\s+/g, "-").toLowerCase()
  await Post.findOneAndUpdate(postDocument, body)

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

  return post
}


const deletePost = async (id) => {
  const post = await Post.findById(id)

  _.forEach(post.comments, async comment => {
    await Comment.findOneAndDelete({ _id: comment })
  })

  await Post.findByIdAndDelete(id)

  return "post deleted"
}


export default async (req, res) => {

  const { user, settings, done } = await serverContext(req, res)

  if (req.method === 'GET') {
    const post = await getPost(req.query.id)
    if ((!post || !post.published) && (!user || !user.isAdmin)) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    return await done(200, post)
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const post = await updatePost(req.query.id, req.body, settings.enableEmailingToUsers)
    return await done(200, post)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const message = await deletePost(req.query.id)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
