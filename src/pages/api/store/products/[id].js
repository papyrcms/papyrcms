import connect from 'next-connect'
import common from '../../../../middleware/common/'
import storeEnabled from '../../../../middleware/storeEnabled'
import Product from '../../../../models/product'


const handler = connect()
handler.use(common)
handler.use(storeEnabled)


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


handler.get(async (req, res) => {
  const product = await getProduct(req.query.id)
  if (!product.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.send(product)
})


handler.put(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const product = await updateProduct(req.query.id, req.body)
  return res.send(product)
})


handler.delete(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteProduct(req.query.id)
  return res.send(message)
})


export default handler
