import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import jwt from 'jsonwebtoken'
import keys from '../../../config/keys'
import common from "../../../middleware/common/"
import registrationEnabled from "../../../middleware/registrationEnabled"
import Mailer from '../../../utilities/mailer'
import User from '../../../models/user'


const handler = connect()
handler.use(common)
handler.use(registrationEnabled)


const verifyEmailSyntax = (email: string) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


handler.post((req: NextApiRequest & Req, res: NextApiResponse & Res) => {
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

  // The LocalStrategy module requires a username
  // Set username and email as the user's email
  const newUser = new User({
    username: email, email, firstName, lastName
  })

  // @ts-ignore passport local mongoose makes this possible
  User.register(newUser, password, async (err: any) => {

    if (err) {
      const message = err.message.replace('username', 'email')
      return res.status(401).send({ message })
    }

    if (res.locals.settings.enableEmailingToUsers) {
      const mailer = new Mailer()
      const subject = `Welcome, ${newUser.firstName}!`

      await mailer.sendEmail(newUser._doc, newUser.email, 'welcome', subject)
    }

    req.login(newUser, { session: false }, (err: any) => {
      if (err) {
        return res.status(400).send({ message: err.message })
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
    })
  })
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
