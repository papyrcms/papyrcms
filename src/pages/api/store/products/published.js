import serverContext from "@/serverContext"
import Product from "@/models/product"


export default async (req, res) => {

  const { user, settings, done } = await serverContext(req, res)
  if ((!user || !user.isAdmin) && !settings.enableStore) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const products = await Product.find({ published: true }).sort({ created: -1 }).lean()
    return await done(200, products)
  }

  return await done(404, { message: 'Page not found' })
}
