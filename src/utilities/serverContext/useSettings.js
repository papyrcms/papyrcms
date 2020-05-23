import fs from 'fs'

export default async () => {
  const files = fs.readdirSync("./settings")

  let settings = {}

  for (const file of files) {
    const settingsMiddleware = require(`./settings/${file}`).default
    const newSettings = await settingsMiddleware()
    settings = { ...settings, ...newSettings }
  }

  return settings
}
