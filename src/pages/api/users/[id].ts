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

  if (req.method === 'DELETE') {
    const { id } = req.query
    const { destroy, findOne, EntityType } = database

    if (user.id === id) {
      return await done(401, {
        message: 'You cannot delete yourself.',
      })
    }

    try {
      const toDelete = await findOne<User>(EntityType.User, { id })
      if (!toDelete) throw new Error('User not found')
      await destroy(EntityType.User, toDelete)
      return await done(200, { message: 'user deleted' })
    } catch (err: any) {
      return await done(400, { message: err.message })
    }
  }

  return await done(404, { message: 'Page not found.' })
}
