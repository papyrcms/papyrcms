import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import serverContext from "@/serverContext"
import keys from '@/keys'
import User from "@/models/user"


export default async (req, res) => {

  if (req.method === 'POST') {

    const { done } = await serverContext(req, res)

    const { token, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return await done(401, { message: 'The new password fields do not match.' })
    }

    const data = jwt.verify(token, keys.jwtSecret)
    const user = await User.findOne({ email: data.email })

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(password, 15)
    } catch (error) {
      return await done(400, error)
    }

    user.password = passwordHash
    user.save()
    return await done(200, { message: 'Your password has been saved!' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
