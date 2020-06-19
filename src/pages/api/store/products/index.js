import serverContext from "@/serverContext"
import Product from "@/models/product"


const getProducts = async () => {
  return await Product.find().sort({ created: -1 }).lean()
}


const createProduct = async (body) => {
  const {
    title,
    content,
    tags,
    mainMedia,
    subImages,
    published,
    created,
    price,
    quantity
  } = body

  const product = new Product({
    title,
    content,
    tags,
    mainMedia,
    subImages,
    published,
    created,
    price,
    quantity
  })
  product.slug = title.replace(/\s+/g, '-').toLowerCase()

  product.save()
  return product
}


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const products = await getProducts()
    return await done(200, products)
  }


  if (req.method === 'POST') {
    const product = await createProduct(req.body)
    return await done(200, product)
  }

  return await done(404, { message: 'Page not found.' })
}