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

  const { user } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const products = await getProducts()
    return res.status(200).send(products)
  }


  if (req.method === 'POST') {
    const product = await createProduct(req.body)
    return res.status(200).send(product)
  }

  return res.status(404).send({ message: 'Page not found.' })
}