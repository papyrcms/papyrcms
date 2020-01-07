import mongoose from 'mongoose'
const { user: User } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
  }

  const { id } = req.query

  if (id === req.user._id) {
    return res.status(401).send({ message: 'You cannot delete yourself.' })
  }

  await User.findOneAndDelete({ _id: id })
  return res.send({ message: 'User deleted' })
}