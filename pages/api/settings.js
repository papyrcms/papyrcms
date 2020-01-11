import mongoose from 'mongoose'
const { settings: Settings } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send({ message: 'You are not allowed to do that.' })
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

  return res.send(req.body)
}