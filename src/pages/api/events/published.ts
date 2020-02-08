import connect from 'next-connect'
import common from '../../../middleware/common/'
import eventsEnabled from '../../../middleware/eventsEnabled'
import Event from '../../../models/event'


const handler = connect()
handler.use(common)
handler.use(eventsEnabled)


handler.get(async (req, res) => {
  const date = new Date()
  const dateFilter = date.setTime(date.getTime() - 2 * 24 * 60 * 60 * 1000)

  const events = await Event.find({ published: true, date: { $gte: dateFilter } })
    .sort({ date: 1 }).lean()

  return res.status(200).send(events)
})


export default handler
