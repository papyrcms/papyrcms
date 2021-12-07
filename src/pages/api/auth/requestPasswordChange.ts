import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import serverContext from '@/serverContext'
import keys from '@/keys'
import { User } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done, database } = await serverContext(req, res)

    const { token, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return await done(401, {
        message: 'The new password fields do not match.',
      })
    }

    const data = jwt.verify(token, keys.jwtSecret) as {
      email: string
    }
    if (typeof data === 'string') {
      return await done(500, { message: 'Invalid token' })
    }

    const { findOne, save, EntityType } = database
    const user = await findOne<User>(EntityType.User, {
      email: data.email,
    })
    if (!user) return await done(400, { message: 'User not found' })

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error: any) {
      return await done(400, error)
    }

    user.password = passwordHash
    await save(EntityType.User, user)

    return await done(200, {
      message: 'Your password has been saved!',
    })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
