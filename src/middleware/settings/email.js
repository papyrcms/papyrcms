import { configureSettings } from "../../utilities/functions"


export default async (req, res, next) => {
  const defaultSettings = {
    enableEmailingToAdmin: true,
    enableEmailingToUsers: false
  }
  const settings = await configureSettings("email", defaultSettings)

  Object.keys(settings).forEach(optionKey => {
    const optionValue = settings[optionKey]

    res.locals.settings[optionKey] = optionValue
  })
  return next()
}
