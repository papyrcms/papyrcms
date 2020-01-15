import connect from "next-connect"
import common from "../../../../middleware/common/"
import isAdmin from "../../../../middleware/isAdmin"
import Order from "../../../../models/order"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.get(async (req, res) => {
  const orders = await Order.find().sort({ created: -1 })
    .populate('user').populate('products').lean()

  return res.send(orders)
})


export default handler
