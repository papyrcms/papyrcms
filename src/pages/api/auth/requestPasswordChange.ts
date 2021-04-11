import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import serverContext from '@/serverContext'
import keys from '@/keys'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done, database } = await serverContext(req, res)

    const { token, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return await done(401, {
        message: 'The new password fields do not match.',
      })
    }

    const data = jwt.verify(token, keys.jwtSecret)
    if (typeof data === 'string') {
      return await done(500, { message: 'Invalid token' })
    }

    const { findOne, update, User } = database
    // @ts-ignore
    const user = await findOne(User, { email: data.email })

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error) {
      return await done(400, error)
    }

    await update(User, { id: user.id }, { password: passwordHash })

    return await done(200, {
      message: 'Your password has been saved!',
    })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
