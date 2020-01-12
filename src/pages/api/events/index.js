import moment from 'moment-timezone'
import mongoose from 'mongoose'
const { event: Event } = mongoose.models


const getEvents = async () => {
  return await Event.find().sort({ date: 1 }).lean()
}


const createEvent = async body => {
  body.date = moment(body.date).tz('America/Chicago').toISOString()

  const event = new Event(body)
  event.slug = event.title.replace(/\s+/g, '-').toLowerCase()

  await event.save()
  return event
}


export default async (req, res) => {
  if (!req.user && !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  try {
    let response
    switch (req.method) {
      case 'GET':
        response = await getEvents()
        return res.send(response)
      case 'POST':
        response = await createEvent(req.body)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
