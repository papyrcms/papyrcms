import mongoose from 'mongoose'
const { product: Product } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  try {
    const products = await Product.find({ published: true }).sort({ created: -1 }).lean()
    return res.send(products)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
