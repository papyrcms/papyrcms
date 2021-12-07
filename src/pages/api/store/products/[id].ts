import { Database, Product } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const getProduct = async (id: string, database: Database) => {
  let product: Product | undefined
  const { findOne, EntityType } = database

  try {
    product = await findOne<Product>(EntityType.Product, { id })
  } catch (err: any) {}

  if (!product) {
    product = await findOne<Product>(EntityType.Product, { slug: id })
  }

  if (!product) {
    product = await findOne<Product>(EntityType.Product, {
      slug: new RegExp(id, 'i'),
    })
  }

  return product
}

const updateProduct = async (
  id: string,
  body: any,
  database: Database
) => {
  const { save, EntityType } = database
  const product = await getProduct(id, database)

  if (!product) throw new Error('Product not found')

  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  body.tags = body.tags.split(',').map((tag: string) => tag.trim())
  const newProduct = { ...product, ...body }

  return await save(EntityType.Product, newProduct)
}

const deleteProduct = async (id: string, database: Database) => {
  const product = await getProduct(id, database)
  if (!product) throw new Error('Product not found')

  const { destroy, EntityType } = database
  await destroy(EntityType.Product, product)

  return 'product deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )
  if (
    ((!user || !user.isAdmin) && !settings.enableStore) ||
    typeof req.query.id !== 'string'
  ) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const product = await getProduct(req.query.id, database)
    if (
      (!product || !product.isPublished) &&
      (!user || !user.isAdmin)
    ) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    return await done(200, product)
  }

  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const product = await updateProduct(
      req.query.id,
      req.body,
      database
    )
    return await done(200, product)
  }

  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const message = await deleteProduct(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
