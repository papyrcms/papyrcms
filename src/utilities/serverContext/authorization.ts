import { Database, User } from '@/types'
import { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'
import keys from '@/keys'

export default async (req: NextApiRequest, database: Database) => {
  if (req.headers.authorization?.toLowerCase().includes('bearer ')) {
    try {
      const [_, token] = req.headers.authorization.split(' ')
      const tokenObject = jwt.verify(token, keys.jwtSecret) as {
        uid: string
      }

      const { EntityType, findOne } = database

      const [one, two] = token.split('.')
      const foundToken = await findOne(EntityType.Token, {
        value: `${one}.${two}`,
      })
      if (!foundToken) throw new Error('Token not found')

      const { uid } = tokenObject
      if (uid) {
        const user = await findOne<User>(EntityType.User, {
          id: uid,
          isBanned: false,
        })
        return user
      }
    } catch (err: any) {}
  }

  return null
}
