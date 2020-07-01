import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import keys from '@/keys'
import serverContext from "@/serverContext"
import Mailer from '@/utilities/mailer'


const verifyEmailSyntax = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


export default async (req, res) => {

  if (req.method === 'POST') {

    const { settings, done, database } = await serverContext(req, res)

    const { firstName, lastName, email, password, passwordConfirm } = req.body

    if (!firstName) {
      return await done(401, { message: 'Please enter your first name' })
    }

    if (!lastName) {
      return await done(401, { message: 'Please enter your last name' })
    }

    // Make sure email is in email format
    if (!verifyEmailSyntax(email)) {
      return await done(401, { message: 'Please use a valid email address' })
    }

    // Make sure password fields match
    if (password !== passwordConfirm) {
      return await done(401, { message: 'The password fields need to match' })
    }

    // Get a hashed password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error) {
      return await done(400, error)
    }

    const userData = {
      email,
      password: passwordHash,
      firstName,
      lastName
    }
    let newUser

    try {
      const { create, User } = database
      newUser = await create(User, userData) 
    } catch (error) {

      let message = 'Uh oh, something went wrong.'
      if (error.code == 11000) {
        message = 'This email is already in use.'
      }
      return await done(401, { message })
    }

    if (settings.enableEmailingToUsers) {
      const mailer = new Mailer(database)
      const subject = `Welcome, ${newUser.firstName}!`

      await mailer.sendEmail(newUser._doc, newUser.email, 'welcome', subject)
    }

    // generate a signed json web token with the contents of user object and return it in the response
    const now = new Date()
    const expiry = new Date(now).setDate(now.getDate() + 30)

    const token = jwt.sign({
      uid: newUser._id,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiry / 1000)
    }, keys.jwtSecret)

    return await done(200, { user: newUser, token })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
