import connect from "next-connect"
import bcrypt from 'bcrypt'
import common from "../../../middleware/common/"
import isLoggedIn from '../../../middleware/isLoggedIn'
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isLoggedIn)


handler.post(async (req, res) => {
  const { oldPass, newPass, confirmPass } = req.body

  // Make sure password fields are filled out
  if (!oldPass) {
    return res.status(401).send({ message: 'You need to fill in your current password.' })
  }

  if (!newPass) {
    return res.status(401).send({ message: 'You need to fill in your new password.' })
  }

  const user = await User.findById(req.user._id)

  if (!user) {
    return res.status(401).send({ message: 'Something went wrong. Try again later.' })
  }

  // Make sure the entered password is the user's password
  let result
  try {
    result = await bcrypt.compare(oldPass, user.password)
  } catch (error) {
    return res.status(401).send(error)
  }

  if (!result) {
    return res.status(401).send({ message: 'The current password you entered is incorrect.' })
  }

  // Check to see new password fields match
  if (newPass !== confirmPass) {
    return res.status(401).send({ message: 'The new password fields do not match.' })
  } else {

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
  }
})


export default (req, res) => handler.apply(req, res)
