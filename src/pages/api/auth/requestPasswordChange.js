import jwt from 'jsonwebtoken'
import connect from "next-connect"
import common from "../../../middleware/common/"
import keys from '../../../config/keys'
import User from "../../../models/user"


const handler = connect()
handler.use(common)


handler.post(async (req, res) => {
  const { token, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(401).send({ message: 'The new password fields do not match.' })
  }

  const data = jwt.verify(token, keys.jwtSecret)
  const user = await User.findOne({ email: data.email })

  // Set the new password
  let passwordHash
  try {
    passwordHash = await bcrypt.hash(newPass, 15)
  } catch (error) {
    return res.status(400).send(error)
  }

  user.password = passwordHash
  user.save()
  res.status(200).send({ message: 'Your password has been saved!' })
})


export default (req, res) => handler.apply(req, res)
