import mongoose from 'mongoose'
const { user: User } = mongoose.models


export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  const { oldPass, newPass, confirmPass, userId } = req.body

  // Make sure password fields are filled out
  if (!oldPass) {
    return res.status(401).send({ message: 'You need to fill in your current password.' })
  } else if (!newPass) {
    return res.status(401).send({ message: 'You need to fill in your new password.' })
  }

  User.findById(userId, (err, foundUser) => {
    if (!!foundUser) {
      // Make sure the entered password is the user's password
      foundUser.authenticate(oldPass, (err, user, passwordError) => {
        if (!!user) {
          // Check to see new password fields match
          if (newPass !== confirmPass) {
            return res.status(401).send({ message: 'The new password fields do not match.' })
          } else {
            // Set the new password
            foundUser.setPassword(newPass, () => {
              foundUser.save()
              res.send({ message: 'Your password has been saved!' })
            })
          }
        } else if (!!err) {
          return res.status(401).send(err)
        } else if (!!passwordError) {
          return res.status(401).send({ message: 'You have entered the wrong current password.' })
        }
      })
    } else {
      return res.status(401).send(err)
    }
  })
}
