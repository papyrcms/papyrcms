import { Database, Order } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const updateOrder = async (
  id: string,
  body: any,
  database: Database
) => {
  const { save, findOne, EntityType } = database
  const order = await findOne<Order>(EntityType.Order, { id })
  if (!order) throw new Error('Order not found')

  order.isShipped = body.isShipped
  return await save<Order>(EntityType.Order, order)
}

const deleteOrder = async (id: string, database: Database) => {
  const { findOne, destroy, EntityType } = database
  const order = await findOne<Order>(EntityType.Order, { id })
  if (!order) throw new Error('Order not found')
  await destroy(EntityType.Order, order)
  return 'order deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin || typeof req.query.id !== 'string') {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'PUT') {
    const order = await updateOrder(req.query.id, req.body, database)
    return await done(200, order)
  }

  if (req.method === 'DELETE') {
    const message = await deleteOrder(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
