import common from "../../../../utilities/serverContext/"
import Product from "../../../../models/product"


export default async (req, res) => {

  const { user, settings } = await common(req, res)
  if ((!user || !user.isAdmin) && settings.enableStore) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const products = await Product.find({ published: true }).sort({ created: -1 }).lean()
    return res.status(200).send(products)
  }

  return res.status(404).send({ message: 'Page not found' })
}
