import { Database } from 'types'
import { NextApiRequest } from 'next'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import keys from '@/keys'

export default async (req: NextApiRequest, database: Database) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.includes('Bearer ')
  ) {
    const token = req.headers.authorization
      .replace('Bearer ', '')

    try {
      const tokenObject = jwt.verify(token, keys.jwtSecret)
      
      if (typeof tokenObject === 'string')
        throw new Error('Invalid token')

      // @ts-ignore yes it does...
      const { uid } = tokenObject
      if (uid) {
        const { User, findOne } = database
        const user = await findOne(
          User,
          { _id: uid, isBanned: false },
          { include: ['cart'] }
        )
        return user
      }
    } catch (err) {}
  }

  return null
}
