import jwt from 'jsonwebtoken'
import serverContext from "../../../utilities/serverContext/"
import keys from '../../../config/keys'
import User from "../../../models/user"


export default async (req, res) => {

  if (req.method === 'POST') {

    await serverContext(req, res)

    const { token, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(401).send({ message: 'The new password fields do not match.' })
    }

    const data = jwt.verify(token, keys.jwtSecret)
    const user = await User.findOne({ email: data.email })

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error) {
      return res.status(400).send(error)
    }

    user.password = passwordHash
    user.save()
    return res.status(200).send({ message: 'Your password has been saved!' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
