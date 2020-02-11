import connect from 'next-connect'
import common from '../../../middleware/common/'
import Page from '../../../models/page'


const handler = connect()
handler.use(common)


const getPages = async () => {
  return await Page.find().sort({ created: -1 }).lean()
}


const createPage = async body => {
  const page = new Page({
    title: body.title,
    className: body.className,
    route: body.route,
    navOrder: body.navOrder,
    css: body.css,
    sections: []
  })

  // Make sure the page has a route
  if (!page.route) {
    throw new Error("Please choose a page route.")
  }

  // Map tags string to an array
  for (const section of body.sections) {

    // Make sure the section has tags
    if (
      !section.tags &&
      section.type !== "ContactForm" &&
      section.type !== "DonateForm"
    ) {
      throw new Error("Please add at least one required tag to each section.")
    }

    // Make sure the section has a valid maxPosts
    if (section.maxPosts < 1 || section.maxPosts % 1 !== 0) {
      throw new Error("You can only choose positive integers for max posts.")
    }

    section.tags = section.tags.split(',').map(tag => {
      let pendingTag = tag
      pendingTag = pendingTag.trim()
      if (!!pendingTag) {
        return pendingTag
      }
    })
    page.sections.push(JSON.stringify(section))
  }

  // Make sure the page has at least one section
  if (page.sections.length === 0) {
    throw new Error("Please add at least one section.")
  }

  try {
    await page.save()
    return page
  } catch (err) {
    let message = "There was a problem. Try again later."
    if (err.code === 11000) {
      message = "You have already saved a page with this route. Go change that one or choose another route."
    }
    throw new Error(message)
  }
}


handler.get(async (req, res) => {
  const pages = await getPages()
  return res.status(200).send(pages)
})


handler.post(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const page = await createPage(req.body)
  return res.status(200).send(page)
})


export default (req, res) => handler.apply(req, res)
