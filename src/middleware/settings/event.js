import { configureSettings } from "../../utilities/functions"


export default async (req, res, next) => {
  const defaultSettings = { enableEvents: false }
  const settings = await configureSettings("event", defaultSettings)

  Object.keys(settings).forEach(optionKey => {
    const optionValue = settings[optionKey]

    res.locals.settings[optionKey] = optionValue
  })
  return next()
}
