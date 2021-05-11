import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import util from 'util'
import path from 'path'
import keys from '@/keys'
import serverContext from '@/serverContext'
import { Blog, Page, Post, Event, Product } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { settings, done, database } = await serverContext(req, res)
    const { findAll, EntityType } = database

    const response: Record<string, any> = {}

    // Settings
    response.settings = settings

    // Public Keys
    const {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey,
      tinyMceKey,
    } = keys
    response.keys = {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey,
      tinyMceKey,
    }

    // Section Options
    response.sectionOptions = {}
    const components = await util.promisify(fs.readdir)(
      path.join('src', 'components')
    )
    components.forEach((component) => {
      const hasOptions = fs.existsSync(
        path.join('src', 'components', component, 'options.ts')
      )
      if (hasOptions) {
        const {
          options,
        } = require(`../../../components/${component}/options`)
        response.sectionOptions = {
          ...response.sectionOptions,
          ...options,
        }
      }
    })

    // Pages
    const pages = await findAll<Page>(EntityType.Page)
    response.pages = pages

    const conditions = { isPublished: true }

    // Posts
    const posts = await findAll<Post>(EntityType.Post, conditions)
    posts.sort((a, b) =>
      (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
    )
    response.posts = posts

    // Blogs
    if (settings.enableBlog) {
      const blogs = await findAll<Blog>(EntityType.Blog, conditions)
      blogs.sort((a, b) => {
        if (a.publishedAt && b.publishedAt)
          return a.publishedAt > b.publishedAt ? -1 : 1
        if (a.publishedAt) return -1
        if (b.publishedAt) return 1
        return (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
      })
      response.blogs = blogs
    }

    // Events
    if (settings.enableEvents) {
      const events = await findAll<Event>(
        EntityType.Event,
        conditions
      )
      events.sort((a, b) => ((a.date || 0) > (b.date || 0) ? -1 : 1))
      const date = new Date()
      const dateFilter = date.setTime(
        date.getTime() - 2 * 24 * 60 * 60 * 1000
      )
      response.events = events.filter(
        (event) => event.date.getTime() >= dateFilter
      )
    }

    // Products
    if (settings.enableStore) {
      const products = await findAll<Product>(
        EntityType.Product,
        conditions
      )
      products.sort((a, b) =>
        (a.createdAt || 0) < (b.createdAt || 0) ? -1 : 1
      )
      response.products = products
    }

    return await done(200, response)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
