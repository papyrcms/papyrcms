import { Database, User } from '@/types'
import { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import keys from '@/keys'

export default async (req: NextApiRequest, database: Database) => {
  if (req.headers.authorization?.toLowerCase().includes('bearer ')) {
    const token = req.headers.authorization
      .toLowerCase()
      .replace('bearer ', '')

    try {
      const tokenObject = jwt.verify(token, keys.jwtSecret) as {
        uid: string
      }

      const { uid } = tokenObject
      if (uid) {
        const user = await database.findOne<User>(
          database.EntityType.User,
          { id: uid, isBanned: false }
        )
        return user
      }
    } catch (err) {}
  }

  return null
}
