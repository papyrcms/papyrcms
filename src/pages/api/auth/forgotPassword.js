import jwt from 'jsonwebtoken'
import serverContext from "@/serverContext"
import Mailer from '@/utilities/mailer'
import keys from '@/keys'


const verifyEmailSyntax = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


export default async (req, res) => {

  if (req.method === 'POST') {

    const { user, settings, done, database } = await serverContext(req, res)

    if (!settings.enableEmailingToUsers && (!user || !user.isAdmin)) {
      return await done(403, { message: "We cannot currently email you." })
    }

    const { email } = req.body

    if (!verifyEmailSyntax(email)) {
      return await done(401, { message: 'Please enter your email address.' })
    }

    const { findOne, User } = database
    const userExists = await findOne(User, { email })

    if (!userExists) {
      let message = 'That email does not exist in our system.'

      if (settings.enableRegistration) {
        message = message + ' Try filling out the "Register" form.'
      }

      return await done(401, { message })
    }

    const mailer = new Mailer(database)
    const subject = "Forgot your password?"
    const variables = {
      passwordResetLink: `${keys.rootURL}/forgotPassword?token=${jwt.sign({ email }, keys.jwtSecret)}`
    }
    mailer.sendEmail(variables, email, 'forgot-password', subject)

    return await done(200, { message: 'Your email is on its way!' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
