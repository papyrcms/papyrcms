import connect from 'next-connect'
import session from 'next-session'
import passport from "passport"
import LocalStrategy from "passport-local"
import fs from "fs"
import isBanned from './isBanned'
import useSettings from './useSettings'
import database from './database'
import User from '../../models/user'


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


const files = fs.readdirSync("./src/middleware/settings")
for (const file of files) {
  const settingsMiddleware = require(`../settings/${file}`).default
  handler.use(settingsMiddleware)
}


export default handler
