import mongoose from 'mongoose'
const { user: User } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  const { email, password } = req.body

  User.findOne({ email }, (error, foundUser) => {

    if (!foundUser) {
      return res.status(401).send({ message: error.message })
    }

    foundUser.authenticate(password, (err, user, passwordError) => {

      if (err) {
        return res.status(401).send({ message: err.message })
      }

      if (passwordError) {
        return res.status(401).send({ message: passwordError.message })
      }

      req.login(user, err => {
        if (err) {
          return res.status(401).send({ message: err.message })
        }

        return res.send(user)
      })
    })
  })
}