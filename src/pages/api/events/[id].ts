import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import connect from "next-connect"
import common from "../../../middleware/common/"
import eventsEnabled from "../../../middleware/eventsEnabled"
import Event from "../../../models/event"


const handler = connect()
handler.use(common)
handler.use(eventsEnabled)


const getEvent = async (id: string) => {
  let event
  try {
    event = await Event.findById(id).lean()
  } catch (err) {}

  if (!event) {
    event = await Event.findOne({ slug: id }).lean()
  }

  return event
}


const updateEvent = async (id: string, body: any) => {
  body.date = moment(body.date).toISOString()
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()

  await Event.findOneAndUpdate({ _id: id }, body)
  return await Event.findOne({ _id: id }).lean()
}


const deleteEvent = async (id: string) => {
  await Event.findByIdAndDelete(id)
  return 'event deleted'
}


handler.get(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const event = await getEvent(req.query.id as string)
  if (!event || !event.published && (!req.user || !req.user.isAdmin)) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  return res.status(200).send(event)
})


handler.put(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const event = await updateEvent(req.query.id as string, req.body)
  return res.status(200).send(event)
})


handler.delete(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deleteEvent(req.query.id as string)
  return res.status(200).send(message)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
