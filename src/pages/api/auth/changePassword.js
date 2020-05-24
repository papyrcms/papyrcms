import bcrypt from 'bcrypt'
import serverContext from "@/serverContext"
import User from "@/models/user"


export default async (req, res) => {

  if (req.method === 'POST') {

    const { user } = await serverContext(req, res)

    if (!user) {
      return res.status(403).send({ message: 'You must be logged in to do that.' })
    }

    const { oldPass, newPass, confirmPass } = req.body

    // Make sure password fields are filled out
    if (!oldPass) {
      return res.status(401).send({ message: 'You need to fill in your current password.' })
    }

    if (!newPass) {
      return res.status(401).send({ message: 'You need to fill in your new password.' })
    }

    const foundUser = await User.findById(user._id)

    if (!foundUser) {
      return res.status(401).send({ message: 'Something went wrong. Try again later.' })
    }

    // Make sure the entered password is the user's password
    let result
    try {
      result = await bcrypt.compare(oldPass, foundUser.password)
    } catch (error) {
      return res.status(401).send(error)
    }

    if (!result) {
      return res.status(401).send({ message: 'The current password you entered is incorrect.' })
    }

    // Check to see new password fields match
    if (newPass !== confirmPass) {
      return res.status(401).send({ message: 'The new password fields do not match.' })
    }

    // Set the new password
    let passwordHash
    try {
      passwordHash = await bcrypt.hash(newPass, 15)
    } catch (error) {
      return res.status(400).send(error)
    }

    foundUser.password = passwordHash
    foundUser.save()
    return res.status(200).send({ message: 'Your password has been saved!' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
