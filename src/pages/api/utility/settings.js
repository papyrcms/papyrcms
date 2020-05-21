import common from '../../../middleware/common/'
import Settings from '../../../models/settings'


export default async (req, res) => {

  const { user, settings } = await common(req, res)

  if (req.method === 'GET') {
    return res.status(200).send(settings)
  }


  if (req.method === 'POST') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }

    const settings = await Settings.find()

    for (const setting of settings) {
      for (const key in req.body) {
        if (typeof setting.options[key] !== 'undefined') {
          setting.options[key] = req.body[key]
          await Settings.findOneAndUpdate({ _id: setting._id }, setting)
        }
      }
    }

    return res.status(200).send(req.body)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
