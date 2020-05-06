import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import connect from "next-connect"
import common from "../../../middleware/common/"
import emailToUsersEnabled from "../../../middleware/emailToUsersEnabled"
import Mailer from '../../../utilities/mailer'
import keys from '../../../config/keys'
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(emailToUsersEnabled)


const verifyEmailSyntax = (email: string) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}


handler.post(async (req: NextApiRequest & Req, res: NextApiResponse & Res) => {
  const { email } = req.body

  if (!verifyEmailSyntax(email)) {
    return res.status(401).send({ message: 'Please enter your email address.' })
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

  return res.status(200).send({ message: 'Your email is on its way!' })
})


export default (req: NextApiRequest & Req, res: NextApiResponse) => handler.apply(req, res)
