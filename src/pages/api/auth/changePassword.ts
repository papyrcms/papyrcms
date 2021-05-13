import { User } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import serverContext from '@/serverContext'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { user, done, database } = await serverContext(req, res)

    if (!user) {
      return await done(403, {
        message: 'You must be logged in to do that.',
      })
    }

    const { oldPass, newPass, confirmPass } = req.body

    // Make sure password fields are filled out
    if (!oldPass) {
      return await done(401, {
        message: 'You need to fill in your current password.',
      })
    }

    if (!newPass) {
      return await done(401, {
        message: 'You need to fill in your new password.',
      })
    }

    const { findOne, save, EntityType } = database
    const foundUser = await findOne<User>(EntityType.User, {
      id: user.id,
    })

    if (!foundUser) {
      return await done(401, {
        message: 'Something went wrong. Try again later.',
      })
    }

    // Make sure the entered password is the user's password
    let result
    try {
      result = await bcrypt.compare(oldPass, foundUser.password)
    } catch (error) {
      return await done(401, error)
    }

    if (!result) {
      return await done(401, {
        message: 'The current password you entered is incorrect.',
      })
    }

    // Check to see new password fields match
    if (newPass !== confirmPass) {
      return await done(401, {
        message: 'The new password fields do not match.',
      })
    }

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(newPass, 15)
    } catch (error) {
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
