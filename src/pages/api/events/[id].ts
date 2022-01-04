import { Database, Event } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import serverContext from '@/serverContext'

const getEvent = async (id: string, database: Database) => {
  let event: Event | undefined
  const { findOne, EntityType } = database

  try {
    event = await findOne<Event>(EntityType.Event, { id })
  } catch (err: any) {}

  if (!event) {
    event = await findOne<Event>(EntityType.Event, { slug: id })
  }

  if (!event) {
    event = await findOne<Event>(EntityType.Event, {
      slug: new RegExp(id, 'i'),
    })
  }

  return event
}

const updateEvent = async (
  id: string,
  body: any,
  database: Database
) => {
  body.date = moment(body.date).toISOString()
  body.slug = body.title.replace(/\s+/g, '-').toLowerCase()
  body.tags = body.tags
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => !!tag)

  const { save, findOne, EntityType } = database
  const event = await findOne<Event>(EntityType.Event, { id })
  if (!event) throw new Error('Event not found')
  return await save(EntityType.Event, { ...event, ...body })
}

const deleteEvent = async (id: string, database: Database) => {
  const { findOne, destroy, EntityType } = database
  const event = await findOne<Event>(EntityType.Event, { id })
  if (!event) throw new Error('Event not found')
  await destroy(EntityType.Event, event)
  return 'event deleted'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, settings, done, database } = await serverContext(
    req,
    res
  )

  if (
    ((!user || !user.isAdmin) && !settings.enableEvents) ||
    typeof req.query.id !== 'string'
  ) {
    return done(403, { message: 'You are not allowed to do that.' })
  }

  if (req.method === 'GET') {
    const event = await getEvent(req.query.id, database)
    if ((!event || !event.isPublished) && (!user || !user.isAdmin)) {
      return done(403, { message: 'You are not allowed to do that.' })
    }
    return done(200, event)
  }

  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return done(403, { message: 'You are not allowed to do that.' })
    }
    const event = await updateEvent(req.query.id, req.body, database)
    return done(200, event)
  }

  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return done(403, { message: 'You are not allowed to do that.' })
    }
    const message = await deleteEvent(req.query.id, database)
    return done(200, message)
  }

  return done(404, { message: 'Page not found' })
}
