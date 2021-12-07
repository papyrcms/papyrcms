import { Database, Section, Page } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'

const getPages = async (database: Database) => {
  const { findAll, EntityType } = database
  const pages = await findAll<Page>(EntityType.Page)
  return pages
}

const createPage = async (body: any, database: Database) => {
  // Make sure the page has a route
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
    if (section.maxPosts < 0 || section.maxPosts % 1 !== 0) {
      throw new Error(
        'You can only choose positive integers for max posts.'
      )
    }

    section.tags = ((section.tags as unknown) as string)
      .split(',')
      .map((tag) => {
        let pendingTag = tag
        pendingTag = pendingTag.trim()
        if (!!pendingTag) {
          return pendingTag
        }
      })
      .filter((tag) => !!tag) as string[]
  })

  // Make sure the page has at least one section
  if (body.sections.length === 0) {
    throw new Error('Please add at least one section.')
  }

  try {
    const { save, EntityType } = database
    return await save<Page>(EntityType.Page, body)
  } catch (err: any) {
    let message = 'There was a problem. Try again later.'
    if (err.code === 11000) {
      message =
        'You have already saved a page with this route. Go change that one or choose another route.'
    }
    throw new Error(message)
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, done, database } = await serverContext(req, res)

  if (req.method === 'GET') {
    const pages = await getPages(database)
    return await done(200, pages)
  }

  if (req.method === 'POST') {
    if (!user || !user.isAdmin) {
      return await done(403, {
        message: 'You are not allowed to do that.',
      })
    }
    const page = await createPage(req.body, database)
    return await done(200, page)
  }

  return await done(404, { message: 'Page not found.' })
}
