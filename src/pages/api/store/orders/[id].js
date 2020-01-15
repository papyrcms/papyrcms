import connect from "next-connect"
import common from "../../../../middleware/common/"
import isAdmin from "../../../../middleware/isAdmin"
import Order from "../../../../models/order"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


const updateOrder = async (id, body) => {
  return await Order.findOneAndUpdate({ _id: id }, { shipped: body.shipped })
}


const deleteOrder = async id => {
  await Order.findByIdAndDelete(id)
  return 'order deleted'
}


handler.put(async (req, res) => {
  const order = await updateOrder(req.query.id, req.body)
  return res.send(order)
})


handler.delete(async (req, res) => {
  const message = await deleteOrder()
  return res.send(message)
})


export default handler
