import moment from 'moment'
import serverContext from "@/serverContext"
import Event from "@/models/event"


const getEvents = async () => {
  return await Event.find().sort({ date: 1 }).lean()
}


const createEvent = async (body) => {
  body.date = moment(body.date).toISOString()

  const event = new Event(body)
  event.slug = event.title.replace(/\s+/g, '-').toLowerCase()

  await event.save()
  return event
}

export default async (req, res) => {

  const { user, done } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }


  if (req.method === 'GET') {
    const events = await getEvents()
    return await done(200, events)
  }


  if (req.method === 'POST') {
    const event = await createEvent(req.body)
    return await done(200, event)
  }

  return await done(404, { message: 'Page not found' })
}
