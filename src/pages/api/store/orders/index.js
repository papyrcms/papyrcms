import serverContext from "@/serverContext"
import Order from "@/models/order"


export default async (req, res) => {

  const { user } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const orders = await Order.find().sort({ created: -1 })
      .populate('user').populate('products').lean()

    return res.status(200).send(orders)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
