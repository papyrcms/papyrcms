import serverContext from '@/serverContext'


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)

  if ((!user || !user.isAdmin) && !settings.enableEvents) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === "GET") {
    const date = new Date()
    const dateFilter = date.setTime(date.getTime() - 2 * 24 * 60 * 60 * 1000)

    // TODO - the date condition might need to be revisited when
    // introducting other DBs. We'll see though
    const { findAll, Event } = database
    const conditions = {
      published: true,
      date: { $gte: dateFilter }
    }
    const events = await findAll(Event, conditions, { sort: { date: 1 } })

    return await done(200, events)
  }

  return await done(404, { message: 'Page not found' })
}
