import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Product } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )
  if ((!user || !user.isAdmin) && !settings.enableStore) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const { findAll, EntityType } = database
    const products = await findAll<Product>(EntityType.Product, {
      isPublished: true,
    })
    products.sort((a, b) =>
      (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
    )
    return await done(200, products)
  }

  return await done(404, { message: 'Page not found' })
}
