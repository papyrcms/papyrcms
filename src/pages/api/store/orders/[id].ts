import { Database } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const updateOrder = async (
  id: string,
  body: any,
  database: Database
) => {
  const { update, findOne, Order } = database
  await update(Order, { _id: id }, { shipped: body.shipped })
  return await findOne(Order, { _id: id })
}

const deleteOrder = async (id: string, database: Database) => {
  const { destroy, Order } = database
  await destroy(Order, { _id: id })
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
