import connect from "next-connect"
import _ from 'lodash'
import common from "../../../middleware/common/"
import Page from "../../../models/page"


const handler = connect()
handler.use(common)


const getPage = async route => {
  const page = await Page.findOne({ route }).lean()
  if (!page) {
    throw new Error('This page does not exist.')
  }

  return page
}


const updatePage = async (body, id) => {
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
    pageData.sections.push(JSON.stringify(section))
  }

  // Make sure the page has at least one section
  if (pageData.sections.length === 0) {
    throw new Error('Please add at least one section.')
  }

  try {
    await Page.findOneAndUpdate({ _id: id }, pageData)
    return await Page.findOne({ _id: id }).lean()
  } catch (err) {
    let message = 'There was a problem. Try again later.'
    if (err.code === 11000) {
      message = 'You have already saved a page with this route. Go change that one or choose another route.'
    }
    throw new Error(message)
  }
}


const deletePage = async id => {
  await Page.findByIdAndDelete(id)
  return 'Page deleted.'
}


handler.get(async (req, res) => {
  try {
    const page = await getPage(req.query.id)
    return res.status(200).send(page)
  } catch (err) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
})


handler.put(async (req, res) => {
  if (!req.user && !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const page = await updatePage(req.body, req.query.id)
  return res.status(200).send(page)
})


handler.delete(async (req, res) => {
  if (!req.user && !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const message = await deletePage(req.query.id)
  return res.status(200).send(message)
})


export default (req, res) => handler.apply(req, res)
