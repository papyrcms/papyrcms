import serverContext from '@/serverContext'


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)

  if (req.method === 'GET') {
    return await done(200, settings)
  }


  if (req.method === 'POST') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }

    const { Settings, findAll, update } = database
    const settings = await findAll(Settings)

    for (const setting of settings) {
      for (const key in req.body) {
        if (typeof setting.options[key] !== 'undefined') {
          setting.options[key] = req.body[key]
          await update(Settings, { _id: setting._id }, setting)
        }
      }
    }

    return await done(200, req.body)
  }

  return await done(404, { message: 'Page not found.' })
}
