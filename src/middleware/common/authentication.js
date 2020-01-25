import passport from "passport"
import LocalStrategy from "passport-local"
import User from '../../models/user'


export default async (req, res, next) => {
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, cb) => User.findOne({ email })
      .then(user => {
        if (!user) {
          return cb(null, false, { message: 'Incorrect email or password.' })
        }
        user.authenticate(password, (err, user, passwordError) => {
          if (err) {
            return res.status(401).send({ message: err.message })
          }

          if (passwordError) {
            return res.status(401).send({ message: passwordError.message })
          }

          return cb(null, user, { message: 'Logged In Successfully' })
        })
      })
      .catch(err => cb(err))
  ))

  return next()
}
