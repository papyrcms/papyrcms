import jwt from 'jsonwebtoken'
import connect from "next-connect"
import common from "../../../middleware/common"
import keys from '../../../config/keys'
import User from "../../../models/user"


const handler = connect()
handler.use(common)


handler.post(async (req, res) => {
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
})


export default handler
