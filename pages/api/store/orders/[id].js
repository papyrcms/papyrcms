import mongoose from 'mongoose'
const { order: Order } = mongoose.models


const updateOrder = async (id, body) => {
  return await Order.findOneAndUpdate({ _id: id }, { shipped: body.shipped })
}


const deleteOrder = async id => {
  await Order.findByIdAndDelete(id)
  return 'order deleted'
}


export default async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'PUT':
        response = await updateOrder(req.query.id, req.body)
        return res.send(response)
      case 'DELETE':
        response = await deleteOrder()
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
