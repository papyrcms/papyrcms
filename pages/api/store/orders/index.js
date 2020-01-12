import mongoose from 'mongoose'
const { order: Order } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    const orders = await Order.find().sort({ created: -1 })
      .populate('user').populate('products').lean()

    return res.send(orders)
  } catch (err) {
    return res.status(400).send({ message: 'You are not allowed to do that.' })
  }
}