import connect from 'next-connect'
import fs from "fs"
import isBanned from './isBanned'
import useSettings from './useSettings'
import database from './database'
import authorization from './authorization'


const handler = connect()


handler.use(database)
handler.use(authorization)
handler.use(useSettings)
handler.use(isBanned)


const files = fs.readdirSync("./src/middleware/settings")
for (const file of files) {
  const settingsMiddleware = require(`../settings/${file}`).default
  handler.use(settingsMiddleware)
}


export default handler
