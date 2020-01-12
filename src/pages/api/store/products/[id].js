import mongoose from 'mongoose'
const { product: Product } = mongoose.models


const getProduct = async id => {
  let product
  try {
    product = await Product.findById(id)
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })
      .lean()
  } catch (err) {}

  if (!product) {
    product = await Product.findOne({ slug: id })
      .populate('comments')
      .populate({ path: 'comments', populate: { path: 'author' } })
      .lean()
  }

  return product
}


const updateProduct = async (id, body) => {
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  const product = await Product.findOneAndUpdate({ _id: id }, body)

  return product
}


const deleteProduct = async id => {
  await Product.findByIdAndDelete(id)
  return 'product deleted'
}


export default async (req, res) => {
  if (!res.locals.settings.enableProducts && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getProduct(req.query.id)
        if (!response.published && (!req.user || !req.user.isAdmin)) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        return res.send(response)
      case 'PUT':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await updateProduct(req.query.id, req.body)
        return res.send(response)
      case 'DELETE':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await deleteProduct(req.query.id)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
