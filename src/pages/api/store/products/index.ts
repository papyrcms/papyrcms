import { Database, Product } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
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
  const { title, tags } = body

  const productData = {
    ...body,
    tags: tags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => !!tag),
    slug: title.replace(/\s+/g, '-').toLowerCase(),
  } as Product

  const { save, EntityType } = database
  const product = await save<Product>(EntityType.Product, productData)

  return product
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
