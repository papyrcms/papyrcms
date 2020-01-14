import connect from 'next-connect'
import session from 'next-session'
import passport from "passport"
import LocalStrategy from "passport-local"
import isBanned from './isBanned'
import useSettings from './useSettings'
import database from './database'
import User from '../models/user'

const handler = connect()

handler.use(database)
handler.use(session())
handler.use(passport.initialize())
handler.use(passport.session())
handler.use((req, res, next) => {
  passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())
  next()
})
handler.use(useSettings)
handler.use(isBanned)

export default handler
