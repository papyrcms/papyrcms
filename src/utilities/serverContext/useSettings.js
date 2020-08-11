import fs from 'fs'
import util from 'util'

export default async (database) => {

  const files = await util.promisify(fs.readdir)("src/utilities/serverContext/settings")

  let settings = {}

  for (const file of files) {
    if (file === 'configureSettings.js') continue
    const settingsMiddleware = require(`./settings/${file}`).default
    const newSettings = await settingsMiddleware(database)
    settings = { ...settings, ...newSettings }
  }

  return settings
}
