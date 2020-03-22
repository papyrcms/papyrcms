import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import Event from "../../../models/event"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


const getEvents = async () => {
  return await Event.find().sort({ date: 1 }).lean()
}


const createEvent = async (body: any) => {
  body.date = moment(body.date).toISOString()

  const event = new Event(body)
  event.slug = event.title.replace(/\s+/g, '-').toLowerCase()

  await event.save()
  return event
}


handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const events = await getEvents()
  return res.status(200).send(events)
})


handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const event = await createEvent(req.body)
  return res.status(200).send(event)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
