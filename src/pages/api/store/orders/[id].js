import common from "../../../../utilities/serverContext/"
import Order from "../../../../models/order"


const updateOrder = async (id, body) => {
  await Order.findOneAndUpdate({ _id: id }, { shipped: body.shipped })
  return await Order.findOne({ _id: id }).lean()
}


const deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id)
  return 'order deleted'
}


export default async (req, res) => {

  const { user } = await common(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    const order = await updateOrder(req.query.id, req.body)
    return res.status(200).send(order)
  }


  if (req.method === 'DELETE') {
    const message = await deleteOrder(req.query.id)
    return res.status(200).send(message)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
