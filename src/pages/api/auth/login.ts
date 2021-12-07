import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import serverContext from '@/serverContext'
import { DbModel, Token, User } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done, database } = await serverContext(req, res)

    let user
    const { findOne, save, EntityType } = database
    try {
      user = await findOne<User>(EntityType.User, {
        email: req.body.email,
      })
    } catch (error: any) {
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
    } catch (error: any) {
      return await done(401, error)
    }

    if (!result) {
      return await done(401, {
        message: 'Email or password is incorrect.',
      })
    }

    const now = new Date()
    const token = await save<Token>(EntityType.Token, {
      id: (undefined as unknown) as string,
      userId: user.id,
      issued: now,
      expiry: new Date(new Date(now).setDate(now.getDate() + 30)),
    } as DbModel)

    return await done(200, { user, token: token?.value })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
