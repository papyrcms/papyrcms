import serverContext from '@/serverContext'
import Event from '@/models/event'


export default async (req, res) => {

  const { user, settings } = await serverContext(req, res)

  if ((!user || !user.isAdmin) && !settings.enableEvents) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === "GET") {
    const date = new Date()
    const dateFilter = date.setTime(date.getTime() - 2 * 24 * 60 * 60 * 1000)

    const events = await Event.find({ published: true, date: { $gte: dateFilter } })
      .sort({ date: 1 }).lean()

    return res.status(200).send(events)
  }

  return res.status(404).send({ message: 'Page not found' })
}
