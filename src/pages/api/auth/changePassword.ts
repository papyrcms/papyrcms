import connect from "next-connect"
import common from "../../../middleware/common/"
import isLoggedIn from '../../../middleware/isLoggedIn'
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isLoggedIn)


handler.post((req, res) => {
  const { oldPass, newPass, confirmPass } = req.body

  // Make sure password fields are filled out
  if (!oldPass) {
    return res.status(401).send({ message: 'You need to fill in your current password.' })
  }

  if (!newPass) {
    return res.status(401).send({ message: 'You need to fill in your new password.' })
  }

  User.findById(req.user._id, (err, foundUser) => {
    if (!foundUser) {
      return res.status(401).send(err)
    }

    // Make sure the entered password is the user's password
    foundUser.authenticate(oldPass, (err, user, passwordError) => {
      if (user) {

        // Check to see new password fields match
        if (newPass !== confirmPass) {
          return res.status(401).send({ message: 'The new password fields do not match.' })
        } else {

          // Set the new password
          foundUser.setPassword(newPass, () => {
            foundUser.save()
            res.status(200).send({ message: 'Your password has been saved!' })
          })
        }
      } else if (err) {
        return res.status(401).send(err)
      } else if (passwordError) {
        return res.status(401).send({ message: 'You have entered the wrong current password.' })
      }
    })
  })
})


export default handler
