import mongoose from 'mongoose'
const { product: Product } = mongoose.models


const getProducts = async () => {
  return await Product.find().sort({ created: -1 }).lean()
}


const createProduct = async body => {
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
  if (!req.user && !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getProducts()
        return res.send(response)
      case 'POST':
        response = await createProduct(req.body)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}