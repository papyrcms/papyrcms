import { configureSettings } from '../../utilities/functions'


export default async (req, res, next) => {
  const defaultSettings = { enableBlog: false }
  const settings = await configureSettings('blog', defaultSettings)

  Object.keys(settings).forEach(optionKey => {
    const optionValue = settings[optionKey]

    res.locals.settings[optionKey] = optionValue
  })
  return next()
}