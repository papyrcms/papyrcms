import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import { Settings } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (req.method === 'GET') {
    return await done(200, settings)
  }

  if (req.method === 'POST') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }

    const { EntityType, findAll, save } = database
    const settings = await findAll<Settings>(EntityType.Settings)

    for (const setting of settings) {
      for (const key in req.body) {
        if (
          typeof setting.options[key] !== 'undefined' &&
          setting.options[key] !== req.body[key]
        ) {
          const newSetting = {
            ...setting,
            options: { ...setting.options, [key]: req.body[key] },
          }
          await save(EntityType.Settings, newSetting)
        }
      }
    }

    return await done(200, req.body)
  }

  return await done(404, { message: 'Page not found.' })
}
