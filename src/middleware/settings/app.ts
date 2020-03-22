import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import { configureSettings } from '../../utilities/functions'


export default async (req: NextApiRequest, res: NextApiResponse & Res, next: Function) => {
  const defaultSettings = { enableMenu: false }
  const settings = await configureSettings("app", defaultSettings)

  _.forEach(settings, (value, key) => {
    res.locals.settings = { ...res.locals.settings, [key]: value }
  })
  return next()
}
