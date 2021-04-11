import { Database, Event } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import moment from 'moment'
import serverContext from '@/serverContext'

const getEvent = async (id: string, database: Database) => {
  let event: Event | undefined
  const { findOne, Event } = database

  try {
    event = await findOne(Event, { id: id })
  } catch (err) {}

  if (!event) {
    event = await findOne(Event, { slug: id })
  }

  if (!event) {
    event = await findOne(Event, { slug: new RegExp(id, 'i') })
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
  body.tags = _.map(_.split(body.tags, ','), (tag) => tag.trim())

  const { update, findOne, Event } = database
  await update(Event, { id: id }, body)
  return await findOne(Event, { id: id })
}

const deleteEvent = async (id: string, database: Database) => {
  const { destroy, Event } = database
  await destroy(Event, { id: id })
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
    if ((!event || !event.published) && (!user || !user.isAdmin)) {
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
