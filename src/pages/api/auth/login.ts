import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serverContext from '@/serverContext'
import keys from '@/keys'
import { User } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done, database } = await serverContext(req, res)

    let user
    try {
      const { findOne, EntityType } = database
      user = await findOne<User>(EntityType.User, {
        email: req.body.email,
      })
    } catch (error) {
      return await done(400, error)
    }

    if (!user) {
      return await done(400, {
        message: 'Email or password is incorrect.',
      })
    }

    let result
    try {
      result = await bcrypt.compare(req.body.password, user.password)
    } catch (error) {
      return await done(401, error)
    }

    if (!result) {
      return await done(401, {
        message: 'Email or password is incorrect.',
      })
    }

    // generate a signed json web token with the contents of user object and return it in the response
    const now = new Date()
    const expiry = new Date(now).setDate(now.getDate() + 30)

    const token = jwt.sign(
      {
        uid: user.id,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(expiry / 1000),
      },
      keys.jwtSecret
    )

    return await done(200, { user, token })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
