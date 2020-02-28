import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async (req, res, next) => {
  const defaultSettings = { enableRegistration: true }
  const settings = await configureSettings("auth", defaultSettings)

  _.forEach(settings, (key, value) => {
    res.locals.settings[key] = value
  })
  return next()
}
