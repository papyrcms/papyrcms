import moment from 'moment-timezone'
import mongoose from 'mongoose'
const { event: Event } = mongoose.models


const getEvent = async id => {
  let event
  try {
    event = await Event.findById(id).lean()
  } catch (err) {}

  if (!event) {
    event = await Event.findOne({ slug: id }).lean()
  }

  return event
}


const updateEvent = (id, body) => {

  body.date = moment(body.date).tz('America/Chicago').toISOString()
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  const event = await Event.findOneAndUpdate({ _id: id }, body)

  return event
}


const deleteEvent = async id => {
  await Event.findByIdAndDelete(id)
  return 'event deleted'
}


export default async (req, res) => {
  if (!res.locals.settings.enableEvents && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getEvent(req.query.id)
        if (!response.published && (!req.user || !req.user.isAdmin)) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        return res.send(response)
      case 'PUT':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await updateEvent(req.query.id, req.body)
        return res.send(response)
      case 'DELETE':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await deleteEvent(req.query.id)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
