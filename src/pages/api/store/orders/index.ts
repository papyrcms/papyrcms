import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Order } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const { EntityType, findAll } = database
    const orders = await findAll<Order>(EntityType.Order)
    orders.sort((a, b) =>
      (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
    )

    return await done(200, orders)
  }

  return await done(404, { message: 'Page not found.' })
}
