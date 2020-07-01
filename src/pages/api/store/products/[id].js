import serverContext from '@/serverContext'


const getProduct = async (id, database) => {
  let product
  const { findOne, Product } = database

  try {
    product = await findOne(Product, { _id: id })
  } catch (err) {}

  if (!product) {
    product = await findOne(Product, { slug: id })
  }

  if (!product) {
    product = await findOne(Product, { slug: new RegExp(id, 'i') })
  }

  return product
}


const updateProduct = async (id, body, database) => {
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  const { update, findOne, Product } = database
  await update(Product, { _id: id }, body)
  return await findOne(Product, { _id: id })
}


const deleteProduct = async (id, database) => {
  const { destroy, Product } = database
  await destroy(Product, { _id: id })
  return 'product deleted'
}


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)
  if ((!user || !user.isAdmin) && !settings.enableStore) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const product = await getProduct(req.query.id, database)
    if ((!product || !product.published) && (!user || !user.isAdmin)) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    return await done(200, product)
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const product = await updateProduct(req.query.id, req.body, database)
    return await done(200, product)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const message = await deleteProduct(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
