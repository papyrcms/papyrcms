import _ from 'lodash'
import { configureSettings } from "../../utilities/functions"


export default async (req, res, next) => {
  const defaultSettings = { enableStore: false }
  const settings = await configureSettings("store", defaultSettings)

  _.forEach(settings, (value, key) => {
    res.locals.settings = { ...res.locals.settings, [key]: value }
  })
  return next()
}
