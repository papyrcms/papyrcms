import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse & Res, next: Function) => {
  if (!res.locals) {
    res.locals = { settings: {} as Settings }
  } else if (!res.locals.settings) {
    res.locals.settings = {} as Settings
  }

  return next()
}
