import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import common from '../../../../middleware/common/'
import storeEnabled from '../../../../middleware/storeEnabled'
import Product from '../../../../models/product'


const handler = connect()
handler.use(common)
handler.use(storeEnabled)


const getProduct = async (id: string) => {
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


const updateProduct = async (id: string, body: any) => {
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  await Product.findOneAndUpdate({ _id: id }, body)

  return await Product.findOne({ _id: id }).lean()
}


const deleteProduct = async (id: string) => {
  await Product.findByIdAndDelete(id)
  return 'product deleted'
}


handler.get(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const product = await getProduct(req.query.id as string)
  if (!product || !product.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.status(200).send(product)
})


handler.put(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const product = await updateProduct(req.query.id as string, req.body)
  return res.status(200).send(product)
})


handler.delete(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteProduct(req.query.id as string)
  return res.status(200).send(message)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
