import jwt from 'jsonwebtoken'
import common from "../../../middleware/common/"
import Mailer from '../../../utilities/mailer'
import keys from '../../../config/keys'
import User from "../../../models/user"


const verifyEmailSyntax = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


export default async (req, res) => {

  if (req.method === 'POST') {

    const { user, settings } = await common(req, res)

    if (!settings.enableEmailingToUsers && (!user || !user.isAdmin)) {
      return res.status(403).send({ message: "We cannot currently email you." })
    }

    const { email } = req.body

    if (!verifyEmailSyntax(email)) {
      return res.status(401).send({ message: 'Please enter your email address.' })
    }

    const userExists = await User.findOne({ email })

    if (!userExists) {
      let message = 'That email does not exist in our system.'

      if (settings.enableRegistration) {
        message = message + ' Try filling out the "Register" form.'
      }

      return res.status(401).send({ message })
    }

    const mailer = new Mailer()
    const subject = "Forgot your password?"
    const variables = {
      passwordResetLink: `${keys.rootURL}/forgotPassword?token=${jwt.sign({ email }, keys.jwtSecret)}`
    }
    mailer.sendEmail(variables, email, 'forgot-password', subject)

    return res.status(200).send({ message: 'Your email is on its way!' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
