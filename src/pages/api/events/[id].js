import moment from 'moment'
import common from "../../../middleware/common/"
import Event from "../../../models/event"


const getEvent = async (id) => {
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
  body.date = moment(body.date).toISOString()
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await Event.findOneAndUpdate({ _id: id }, body)
  return await Event.findOne({ _id: id }).lean()
}


const deleteEvent = async (id) => {
  await Event.findByIdAndDelete(id)
  return 'event deleted'
}


export default async (req, res) => {

  const { user, settings } = await common(req, res)

  if ((!user || !user.isAdmin) && settings.enableEvents) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === "GET") {
    const event = await getEvent(req.query.id)
    if (!event || !event.published && (!user || !user.isAdmin)) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    return res.status(200).send(event)
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    const event = await updateEvent(req.query.id, req.body)
    return res.status(200).send(event)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    const message = await deleteEvent(req.query.id)
    return res.status(200).send(message)
  }

  return res.status(404).send({ message: 'Page not found' })
}