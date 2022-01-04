import { Database, Event } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import serverContext from '@/serverContext'

const getEvents = async (database: Database) => {
  const { findAll, EntityType } = database
  const events = await findAll<Event>(EntityType.Event)
  events.sort((a, b) => ((a.date || 0) > (b.date || 0) ? -1 : 1))
  return events
}

const createEvent = async (body: any, database: Database) => {
  body.date = moment(body.date).toISOString()

  const eventData = {
    ...body,
    slug: body.title.replace(/\s+/g, '-').toLowerCase(),
    tags: body.tags
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => !!tag),
  }
  const { save, EntityType } = database
  return await save<Event>(EntityType.Event, eventData)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, {
      message: 'You are not allowed to do that.',
    })
  }

  if (req.method === 'GET') {
    const events = await getEvents(database)
    return await done(200, events)
  }

  if (req.method === 'POST') {
    const event = await createEvent(req.body, database)
    return await done(200, event)
  }

  return await done(404, { message: 'Page not found' })
}
