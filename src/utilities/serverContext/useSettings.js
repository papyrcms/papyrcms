import fs from 'fs'

export default async () => {

  const files = fs.readdirSync("src/utilities/serverContext/settings")

  let settings = {}

  for (const file of files) {
    if (file === 'configureSettings.js') continue
    const settingsMiddleware = require(`./settings/${file}`).default
    const newSettings = await settingsMiddleware()
    settings = { ...settings, ...newSettings }
  }

  return settings
}
