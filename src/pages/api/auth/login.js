import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serverContext from "../../../utilities/serverContext/"
import User from '../../../models/user'
import keys from '../../../config/keys'


export default async (req, res) => {

  if (req.method === 'POST') {

    await serverContext(req, res)

    let user
    try {
      user = await User.findOne({ email: req.body.email })
    } catch (error) {
      return res.status(401).send(error)
    }

    if (!user) {
      return res.status(400).send({
        message: 'Email or password is incorrect.'
      })
    }

    let result
    try {
      result = await bcrypt.compare(req.body.password, user.password)
    } catch (error) {
      return res.status(401).send(error)
    }

    if (!result) {
      return res.status(400).send({ message: 'Email or password is incorrect.' })
    }

    // generate a signed json web token with the contents of user object and return it in the response
    const now = new Date()
    const expiry = new Date(now).setDate(now.getDate() + 30)

    const token = jwt.sign({
      uid: user._id,
      iat: Math.floor(now.getTime()/1000),
      exp: Math.floor(expiry/1000)
    }, keys.jwtSecret)

    return res.status(200).send({ user, token })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
