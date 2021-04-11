import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { User } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'PUT') {
    const { userId, isBanned } = req.body
    const { findOne, save, EntityType } = database

    const userToBan = await findOne<User>(EntityType.User, {
      id: userId,
    })
    if (!userToBan)
      return await done(400, { message: 'User not found' })

    userToBan.isBanned = isBanned
    await save(EntityType.User, userToBan)
    return await done(200, { message: 'Success' })
  }

  return await done(404, { message: 'Page not found' })
}
