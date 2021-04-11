import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Message } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return done(403, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'DELETE') {
    const { destroy, EntityType, findOne } = database
    const message = await findOne<Message>(EntityType.Message, {
      id: req.query.id,
    })
    if (!message)
      return await done(400, { message: 'Message not found' })

    await destroy(EntityType.Message, message)
    return done(200, 'message deleted')
  }

  return done(404, { message: 'Page not found.' })
}
