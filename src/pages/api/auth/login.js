import connect from "next-connect"
import jwt from 'jsonwebtoken'
import passport from 'passport'
import common from "../../../middleware/common/"
import keys from '../../../config/keys'


const handler = connect()
handler.use(common)


handler.post(async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {

    if (err || !user) {
      return res.status(400).send({
        message: 'Something is not right',
        user: user
      })
    }

    req.login(user, { session: false }, error => {
      if (error) {
        res.send(error)
      }

      // generate a signed json web token with the contents of user object and return it in the response
      const now = new Date()
      const expiry = new Date(now).setDate(now.getDate() + 30)

      const token = jwt.sign({
        uid: user._id,
        iat: Math.floor(now.getTime()/1000),
        exp: Math.floor(expiry/1000)
      }, keys.jwtSecret)

      return res.send({ user, token })
    })
  })(req, res)
})


export default handler
