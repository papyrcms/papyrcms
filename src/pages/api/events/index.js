import moment from 'moment-timezone'
import connect from "next-connect"
import common from "../../../middleware/common"
import isAdmin from "../../../middleware/isAdmin"
import Event from "../../../models/event"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


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


handler.get(async (req, res) => {
  const events = await getEvents()
  return res.send(events)
})


handler.post(async (req, res) => {
  const event = await createEvent(req.body)
  return res.send(event)
})


export default handler
