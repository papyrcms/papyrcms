import mongoose from 'mongoose'
const { event: Event } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  const date = new Date(new Date().toISOString())
  const dateFilter = date.setTime(date.getTime() - 2 * 24 * 60 * 60 * 1000)

  try {
    const events = await Event.find({ published: true, date: { $gte: dateFilter } })
      .sort({ date: 1 }).lean()

    return res.send(events)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
