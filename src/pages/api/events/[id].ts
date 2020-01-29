import moment from 'moment-timezone'
import connect from "next-connect"
import common from "../../../middleware/common/"
import eventsEnabled from "../../../middleware/eventsEnabled"
import Event from "../../../models/event"


const handler = connect()
handler.use(common)
handler.use(eventsEnabled)


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


const updateEvent = async (id, body) => {
  body.date = moment(body.date).tz('America/Chicago').toISOString()
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await Event.findOneAndUpdate({ _id: id }, body)
  return await Event.findOne({ _id: id }).lean()
}


const deleteEvent = async id => {
  await Event.findByIdAndDelete(id)
  return 'event deleted'
}


handler.get(async (req, res) => {
  const event = await getEvent(req.query.id)
  if (!event.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.send(event)
})


handler.put(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const event = await updateEvent(req.query.id, req.body)
  return res.send(event)
})


handler.delete(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteEvent(req.query.id)
  return res.send(message)
})


export default handler
