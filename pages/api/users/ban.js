import mongoose from 'mongoose'
const { user: User } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
  }

  const { userId, isBanned } = req.body

  await User.findByIdAndUpdate(userId, { isBanned })
  return res.send({ message: 'Success' })
}
