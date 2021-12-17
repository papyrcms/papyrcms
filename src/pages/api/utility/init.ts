import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serverContext from '@/serverContext'
import keys from '@/keys'
import { Page, Post, Tags, User } from '@/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done, database } = await serverContext(req, res)

    const { save, countAll, destroyAll, EntityType } = database

    // Since this is the initial site setup,
    // only run if there are no users, posts, or pages
    const userCount = await countAll(EntityType.User)
    const postCount = await countAll(EntityType.Post)
    const pageCount = await countAll(EntityType.Page)

    if (userCount > 0 || postCount > 0 || pageCount > 0) {
      return await done(500, {
        message:
          'You can only run this before your site has any data.',
      })
    }

    // We're wrapping this in one big try/catch because
    // if any of it goes wrong, we must undo it all
    try {
      const {
        email,
        password,
        headerTitle,
        headerSubtitle,
        siteLogo,
        footerTitle,
        footerSubtitle,
        pageHeader,
        pageImage,
        pageContent,
      } = req.body

      // First, the admin user
      // Get a hashed password
      let passwordHash
      try {
        passwordHash = await bcrypt.hash(password, 15)
      } catch (error: any) {
        return await done(400, error)
      }

      const userFields = {
        email,
        password: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
      } as User
      const user = await save<User>(EntityType.User, userFields)

      // generate a signed json web token with the contents of user object and return it in the response
      const now = new Date()
      const expiry = new Date(now).setDate(now.getDate() + 30)

      const token = jwt.sign(
        {
          uid: user?.id,
          iat: Math.floor(now.getTime() / 1000),
          exp: Math.floor(expiry / 1000),
        },
        keys.jwtSecret
      )

      // Next create the header and footer
      const headerFields = {
        title: headerTitle,
        content: headerSubtitle,
        media: siteLogo,
        tags: [Tags.sectionHeader],
        isPublished: true,
      } as Post
      const header = await save<Post>(EntityType.Post, headerFields)

      const footerFields = {
        title: footerTitle,
        content: footerSubtitle,
        tags: [Tags.sectionFooter],
        isPublished: true,
      } as Post
      const footer = await save<Post>(EntityType.Post, footerFields)

      // Next, create the first landing page
      const pagePostFields = {
        title: pageHeader,
        content: pageContent,
        media: pageImage,
        tags: ['first-page'],
        isPublished: true,
      } as Post
      const pagePost = await save<Post>(
        EntityType.Post,
        pagePostFields
      )

      const pageFields = {
        title: 'Home',
        route: 'home',
        navOrder: 1,
        sections: [
          {
            type: 'Standard',
            tags: ['first-page'],
            maxPosts: 1,
          },
        ],
      } as Page
      const page = await save<Page>(EntityType.Page, pageFields)

      return await done(200, {
        posts: [header, footer, pagePost],
        pages: [page],
        token,
        user,
      })
    } catch (err: any) {
      // If something in the process fails, we must
      // undo everything done in the process so the
      // user can try again.
      await destroyAll(EntityType.User)
      await destroyAll(EntityType.Post)
      await destroyAll(EntityType.Page)

      return await done(500, { error: err.message })
    }
  }

  return res.status(404).send({ message: 'Page not found.' })
}
