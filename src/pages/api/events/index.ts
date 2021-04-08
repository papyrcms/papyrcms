import { Database } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import moment from 'moment'
import serverContext from '@/serverContext'

const getEvents = async (database: Database) => {
  const { findAll, Event } = database
  return await findAll(Event, {}, { sort: { date: 1 } })
}

const createEvent = async (body: any, database: Database) => {
  body.date = moment(body.date).toISOString()

  const eventData = {
    ...body,
    slug: body.title.replace(/\s+/g, '-').toLowerCase(),
    tags: _.map(_.split(body.tags, ','), (tag) => tag.trim()),
  }
  const { create, Event } = database

  return create(Event, eventData)
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
