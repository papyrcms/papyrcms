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
    const { userId, isAdmin } = req.body
    const { findOne, save, EntityType } = database

    const userToSave = await findOne<User>(EntityType.User, {
      id: userId,
    })
    if (!userToSave)
      return await done(400, { message: 'User not found' })

    userToSave.isAdmin = isAdmin
    await save<User>(EntityType.User, userToSave)

    return await done(200, { message: 'Success' })
  }

  return await done(404, { message: 'Page not found.' })
}
