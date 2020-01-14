import connect from "next-connect"
import common from "../../../middleware/common"
import User from "../../../models/user"


const handler = connect()
handler.use(common)


handler.post(async (req, res) => {
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
})


export default handler
