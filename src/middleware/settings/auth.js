import { configureSettings } from "../../utilities/functions"


export default async (req, res, next) => {
  const defaultSettings = { enableRegistration: true }
  const settings = await configureSettings("auth", defaultSettings)

  Object.keys(settings).forEach(optionKey => {
    const optionValue = settings[optionKey]

    res.locals.settings[optionKey] = optionValue
  })
  return next()
}
