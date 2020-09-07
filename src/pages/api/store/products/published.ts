import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

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
    const { findAll, Product } = database
    const products = await findAll(
      Product,
      { published: true },
      { sort: { created: -1 } }
    )
    return await done(200, products)
  }

  return await done(404, { message: 'Page not found' })
}
