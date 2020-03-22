import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../../middleware/common/"
import storeEnabled from "../../../../middleware/storeEnabled"
import Product from "../../../../models/product"


const handler = connect()
handler.use(common)
handler.use(storeEnabled)


handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const products = await Product.find({ published: true }).sort({ created: -1 }).lean()
  return res.status(200).send(products)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
