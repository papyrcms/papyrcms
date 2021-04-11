import { Database, Product } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getProduct = async (id: string, database: Database) => {
  let product: Product | undefined
  const { findOne, Product } = database

  try {
    product = await findOne(
      Product,
      { id: id },
      { include: ['comments'] }
    )
  } catch (err) {}

  if (!product) {
    product = await findOne(
      Product,
      { slug: id },
      { include: ['comments'] }
    )
  }

  if (!product) {
    product = await findOne(
      Product,
      { slug: new RegExp(id, 'i') },
      { include: ['comments'] }
    )
  }

  return product
}

const updateProduct = async (
  id: string,
  body: any,
  database: Database
) => {
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  body.tags = _.map(_.split(body.tags, ','), (tag) => tag.trim())

  const { update, findOne, Product } = database

  await update(Product, { id: id }, body)
  return await findOne(Product, { id: id })
}

const deleteProduct = async (id: string, database: Database) => {
  const { destroy, Product } = database
  await destroy(Product, { id: id })
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
      (!product || !product.published) &&
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
