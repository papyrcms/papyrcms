import serverContext from "@/serverContext"
import Order from "@/models/order"


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const orders = await Order.find().sort({ created: -1 })
      .populate('user').populate('products').lean()

    return await done(200, orders)
  }

  return await done(404, { message: 'Page not found.' })
}
