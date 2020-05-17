import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import _ from 'lodash'
import common from "../../../middleware/common/"
import Post from "../../../models/post"
import Comment from "../../../models/comment"
import Mailer from "../../../utilities/mailer"


const handler = connect()
handler.use(common)


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


handler.get(async (req, res) => {
  const post = await getPost(req.query.id)
  if (!post || !post.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.status(200).send(post)
})


handler.put(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const post = await updatePost(req.query.id, req.body, res.locals.settings.enableEmailingToUsers)
  return res.status(200).send(post)
})


handler.delete(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deletePost(req.query.id)
  return res.status(200).send(message)
})


export default (req, res) => handler.apply(req, res)
