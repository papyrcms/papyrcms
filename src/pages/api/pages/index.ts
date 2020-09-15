import { Database } from 'types'
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import serverContext from '@/serverContext'

const getPages = async (database: Database) => {
  const { findAll, Page } = database
  return await findAll(Page, {}, { sort: { created: -1 } })
}

const createPage = async (body: any, database: Database) => {
  const pageData = {
    title: body.title,
    className: body.className,
    route: body.route,
    navOrder: body.navOrder,
    omitDefaultHeader: body.omitDefaultHeader,
    omitDefaultFooter: body.omitDefaultFooter,
    css: body.css,
    sections: [] as string[],
  }

  // Make sure the page has a route
  if (!pageData.route) {
    throw new Error('Please choose a page route.')
  }

  // Map tags string to an array
  for (const section of body.sections) {
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

    section.tags = _.map(_.split(section.tags, ','), (tag) => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()
      if (!!pendingTag) {
        return pendingTag
      }
    })
    pageData.sections.push(JSON.stringify(section))
  }

  // Make sure the page has at least one section
  if (pageData.sections.length === 0) {
    throw new Error('Please add at least one section.')
  }

  try {
    const { create, Page } = database
    return await create(Page, pageData)
  } catch (err) {
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
