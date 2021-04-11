import { Database, Product } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getProducts = async (database: Database) => {
  const { findAll, EntityType } = database
  const products = await findAll<Product>(EntityType.Product)
  products.sort((a, b) =>
    (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
  )
  return products
}

const createProduct = async (body: any, database: Database) => {
  const {
    title,
    content,
    tags,
    media,
    subImages,
    isPublished,
    created,
    price,
    quantity,
  } = body

  const productData = {
    title,
    content,
    tags: _.map(_.split(tags, ','), (tag) => tag.trim()),
    media,
    subImages,
    isPublished,
    created,
    price,
    quantity,
    slug: title.replace(/\s+/g, '-').toLowerCase(),
  } as Product

  const { save, EntityType } = database

  return await save<Product>(EntityType.Product, productData)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const products = await getProducts(database)
    return await done(200, products)
  }

  if (req.method === 'POST') {
    const product = await createProduct(req.body, database)
    return await done(200, product)
  }

  return await done(404, { message: 'Page not found.' })
}
