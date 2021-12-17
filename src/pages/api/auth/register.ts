import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import serverContext from '@/serverContext'
import Mailer from '@/utilities/mailer'
import { DbModel, Tags, Token, User } from '@/types'

const verifyEmailSyntax = (email: string) => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { settings, done, database } = await serverContext(req, res)

    const { firstName, lastName, email, password, passwordConfirm } =
      req.body

    if (!firstName) {
      return await done(401, {
        message: 'Please enter your first name',
      })
    }

    if (!lastName) {
      return await done(401, {
        message: 'Please enter your last name',
      })
    }

    // Make sure email is in email format
    if (!verifyEmailSyntax(email)) {
      return await done(401, {
        message: 'Please use a valid email address',
      })
    }

    // Make sure password fields match
    if (password !== passwordConfirm) {
      return await done(401, {
        message: 'The password fields need to match',
      })
    }

    // Get a hashed password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error: any) {
      return await done(400, error)
    }

    const userData = {
      email,
      password: passwordHash,
      firstName,
      lastName,
    } as User
    let newUser
    const { save, EntityType } = database

    try {
      newUser = await save<User>(EntityType.User, userData)
      if (!newUser) throw new Error()
    } catch (error: any) {
      let message = 'Uh oh, something went wrong.'
      if (error.code == 11000) {
        message = 'This email is already in use.'
      }
      return await done(401, { message })
    }

    if (settings.enableEmailingToUsers) {
      const mailer = new Mailer(database)
      const subject = `Welcome, ${newUser.firstName}!`

      await mailer.sendEmail(
        JSON.parse(JSON.stringify(newUser)),
        newUser.email,
        Tags.welcome,
        subject
      )
    }

    const now = new Date()
    const token = await save<Token>(EntityType.Token, {
      id: undefined as unknown as string,
      userId: newUser.id,
      issued: now,
      expiry: new Date(new Date(now).setDate(now.getDate() + 30)),
    } as DbModel)

    return await done(200, { user: newUser, token: token?.value })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
