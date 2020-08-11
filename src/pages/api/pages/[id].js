import _ from 'lodash'
import serverContext from "@/serverContext"


const getPage = async (route, database) => {
  const { findOne, Page } = database
  const page = await findOne(Page, { route })
  
  if (!page) {
    throw new Error('This page does not exist.')
  }

  return page
}


const updatePage = async (body, id, database) => {
  const pageData = {
    title: body.title,
    className: body.className,
    route: body.route,
    navOrder: body.navOrder,
    css: body.css,
    sections: []
  }

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
      throw new Error('Please add at least one required tag to each section.')
    }

    // Make sure the section has a valid maxPosts
    if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
      throw new Error('You can only choose positive integers for max posts.')
    }

    section.tags = _.map(_.split(section.tags, ','), tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()
      if (!!pendingTag) {
        return pendingTag
      }
    })
    const newSection = JSON.stringify(section)
    pageData.sections.push(newSection)
  }

  // Make sure the page has at least one section
  if (pageData.sections.length === 0) {
    throw new Error('Please add at least one section.')
  }

  try {
    const { update, findOne, Page } = database
    await update(Page, { _id: id }, pageData)
    return await findOne(Page, { _id: id })
  } catch (err) {
    let message = 'There was a problem. Try again later.'
    if (err.code === 11000) {
      message = 'You have already saved a page with this route. Go change that one or choose another route.'
    }
    throw new Error(message)
  }
}


const deletePage = async (id, database) => {
  const { destroy, Page } = database
  await destroy(Page, { _id: id })
  return 'Page deleted.'
}


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)


  if (req.method === 'GET') {
    try {
      const page = await getPage(req.query.id, database)
      return await done(200, page)
    } catch (err) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
  }


  if (req.method === 'PUT') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const page = await updatePage(req.body, req.query.id, database)
    return await done(200, page)
  }


  if (req.method === 'DELETE') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const message = await deletePage(req.query.id, database)
    return await done(200, message)
  }

  return await done(404, { message: 'Page not found.' })
}
