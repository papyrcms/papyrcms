import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import Mailer from '../../../utilities/mailer'
import keys from '../../../config/keys'
const { user: User } = mongoose.models


const verifyEmailSyntax = email => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found' })
  }

  if (!res.locals.settings.enableEmailingToUsers) {
    return res.status(401).send({ message: 'Mailing is disabled. Please contact a site administrator to reset your password.' })
  }

  const { email } = req.body

  if (!verifyEmailSyntax(email)) {
    res.status(401).send({ message: 'Please enter your email address.' })
  }

  const userExists = await User.findOne({ email })

  if (!userExists) {
    let message = 'That email does not exist in our system.'

    if (res.locals.settings.enableRegistration) {
      message = message + ' Try filling out the "Register" form.'
    }

    return res.status(401).send({ message })
  }

  const mailer = new Mailer()
  const subject = "Forgot your password?"
  const variables = {
    website: keys.rootURL,
    token: jwt.sign({ email }, keys.jwtSecret)
  }
  mailer.sendEmail(variables, email, 'forgot-password', subject)

  return res.send({ message: 'Your email is on its way!' })
}
