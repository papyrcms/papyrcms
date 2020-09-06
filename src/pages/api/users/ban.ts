import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'PUT') {
    const { userId, isBanned } = req.body
    const { update, User } = database

    await update(User, { _id: userId }, { isBanned })
    return await done(200, { message: 'Success' })
  }

  return await done(404, { message: 'Page not found' })
}
