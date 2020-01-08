import mongoose from 'mongoose'
const { post: Post } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  try {
    const posts = await Post.find({ published: true }).sort({ created: -1 }).lean()
    return res.send(posts)
  } catch (err) {
    return res.status(401).send({ message: err.message })
  }
}
