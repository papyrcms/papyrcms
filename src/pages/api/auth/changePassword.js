import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import keys from '../../../config/keys'
const { user: User } = mongoose.models

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found' })
  }

  try {

    const { token, password, confirmPassword } = req.body

    const data = jwt.verify(token, keys.jwtSecret)

    if (password !== confirmPassword) {
      res.status(401).send({ message: 'The new password fields do not match.' })
    }

    const foundUser = await User.findOne({ email: data.email })

    // Set the new password
    foundUser.setPassword(password, () => {
      foundUser.save()
      res.send({ message: 'Your password has been saved!' })
    })

  } catch (e) {
    return res.status(401).send({ message: err.message })
  }
}
