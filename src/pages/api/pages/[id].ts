import { Database, Page, Section } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getPage = async (route: string, database: Database) => {
  const { findOne, EntityType } = database
  const page = await findOne<Page>(EntityType.Page, { route })

  if (!page) {
    throw new Error('This page does not exist.')
  }

  return page
}

const updatePage = async (
  body: any,
  id: string,
  database: Database
) => {
  if (!body.route) {
    throw new Error('Please choose a page route.')
  }

  // Map tags string to an array
  body.sections.forEach((section: Section) => {
    // Make sure the section has tags
    if (
      !section.tags &&
      section.type !== 'ContactForm' &&
      section.type !== 'DonateForm'
    ) {
      throw new Error(
        'Please add at least one required tag to each section.'
      )
    }

    // Make sure the section has a valid maxPosts
    if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
      throw new Error(
        'You can only choose positive integers for max posts.'
      )
    }

    const tags = _.map(
      _.split((section.tags as unknown) as string, ','),
      (tag) => {
        let pendingTag = tag
        pendingTag = pendingTag.trim()
        if (!!pendingTag) {
          return pendingTag
        }
      }
    )
    body.section.tags = _.filter(tags, (tag) => !!tag) as string[]
  })

  // Make sure the page has at least one section
  if (body.sections.length === 0) {
    throw new Error('Please add at least one section.')
  }

  try {
    const { save, findOne, EntityType } = database
    const page = await findOne<Page>(EntityType.Page, { id })
    if (!page) throw new Error('Page not found')
    return await save<Page>(EntityType.Page, { ...page, ...body })
  } catch (err) {
    let message = 'There was a problem. Try again later.'
    if (err.code === 11000) {
      message =
        'You have already saved a page with this route. Go change that one or choose another route.'
    }
    throw new Error(message)
  }
}

const deletePage = async (id: string, database: Database) => {
  const { findOne, destroy, EntityType } = database
  const page = await findOne<Page>(EntityType.Page, { id })
  if (!page) throw new Error('Page not found')
  await destroy(EntityType.Page, page)
  return 'Page deleted.'
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (typeof req.query.id !== 'string') {
    return await done(500, { message: 'id was not a string' })
  }

  if (req.method === 'GET') {
    try {
      const page = await getPage(req.query.id, database)
      return await done(200, page)
    } catch (err) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
  }

  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const page = await updatePage(req.body, req.query.id, database)
    return await done(200, page)
  }

  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const message = await deletePage(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
