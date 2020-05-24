import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import keys from '@/keys'
import serverContext from "@/serverContext"
import Mailer from '@/utilities/mailer'
import User from '@/models/user'


const verifyEmailSyntax = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


export default async (req, res) => {

  if (req.method === 'POST') {

    const { settings } = await serverContext(req, res)

    const { firstName, lastName, email, password, passwordConfirm } = req.body

    if (!firstName) {
      return res.status(401).send({ message: 'Please enter your first name' })
    }

    if (!lastName) {
      return res.status(401).send({ message: 'Please enter your last name' })
    }

    // Make sure email is in email format
    if (!verifyEmailSyntax(email)) {
      return res.status(401).send({ message: 'Please use a valid email address' })
    }

    // Make sure password fields match
    if (password !== passwordConfirm) {
      return res.status(401).send({ message: 'The password fields need to match' })
    }

    // Get a hashed password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error) {
      return res.status(400).send(error)
    }

    // Set username and email as the user's email
    const newUser = new User({
      email,
      password: passwordHash,
      firstName,
      lastName
    })

    try {
      await newUser.save()
    } catch (error) {

      let message = 'Uh oh, something went wrong.'
      if (error.code == 11000) {
        message = 'This email is already in use.'
      }
      return res.status(401).send({ message })
    }

    if (settings.enableEmailingToUsers) {
      const mailer = new Mailer()
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

    return res.status(200).send({ user: newUser, token })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
