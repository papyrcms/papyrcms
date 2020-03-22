import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../../middleware/common/"
import isAdmin from "../../../../middleware/isAdmin"
import Order from "../../../../models/order"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


const updateOrder = async (id: string, body: any) => {
  await Order.findOneAndUpdate({ _id: id }, { shipped: body.shipped })
  return await Order.findOne({ _id: id }).lean()
}


const deleteOrder = async (id: string) => {
  await Order.findByIdAndDelete(id)
  return 'order deleted'
}


handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const order = await updateOrder(req.query.id as string, req.body)
  return res.status(200).send(order)
})


handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const message = await deleteOrder(req.query.id as string)
  return res.status(200).send(message)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
