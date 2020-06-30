import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serverContext from '@/serverContext'
import keys from '@/keys'
// import User from '@/models/user'
// import Post from '@/models/post'
// import Page from '@/models/page'


export default async (req, res) => {

  if (req.method === 'POST') {

    const { done, database } = await serverContext(req, res)

    const { create, countAll, destroyAll, User, Post, Page } = database

    // Since this is the initial site setup,
    // only run if there are no users, posts, or pages
    const userCount = await countAll(User)
    const postCount = await countAll(Post)
    const pageCount = await countAll(Page)

    if (
      userCount > 0 ||
      postCount > 0 ||
      pageCount > 0
    ) {
      return await done(500, { message: 'You can only run this before your site has any data.' })
    }

    // We're wrapping this in one big try/catch because
    // if any of it goes wrong, we must undo it all
    try {

      const {
        email, password,
        headerTitle, headerSubtitle, siteLogo,
        footerTitle, footerSubtitle,
        pageHeader, pageImage, pageContent
      } = req.body

      // First, the admin user
      // Get a hashed password
      let passwordHash
      try {
        passwordHash = await bcrypt.hash(password, 15)
      } catch (error) {
        return await done(400, error)
      }

      const userFields = {
        email,
        password: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
      }
      const user = await create(User, userFields)

      // generate a signed json web token with the contents of user object and return it in the response
      const now = new Date()
      const expiry = new Date(now).setDate(now.getDate() + 30)

      const token = jwt.sign({
        uid: user._id,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(expiry / 1000)
      }, keys.jwtSecret)

      // Next create the header and footer
      const headerFields = {
        title: headerTitle,
        content: headerSubtitle,
        mainMedia: siteLogo,
        tags: ['section-header'],
        published: true
      }
      const header = await create(Post, headerFields)

      const footerFields = {
        title: footerTitle,
        content: footerSubtitle,
        tags: ['section-footer'],
        published: true
      }
      const footer = await create(Post, footerFields)

      // Next, create the first landing page
      const pagePostFields = {
        title: pageHeader,
        content: pageContent,
        mainMedia: pageImage,
        tags: ['first-page'],
        published: true
      }
      const pagePost = await create(Post, pagePostFields)

      const pageFields = {
        title: 'Home',
        route: 'home',
        navOrder: 1,
        sections: [JSON.stringify({
          type: "Standard",
          tags: ["first-page"],
          maxPosts: 1
        })]
      }
      const page = await create(Page, pageFields)

      return await done(200, {
        posts: [header, footer, pagePost],
        pages: [page],
        token,
        user
      })
    } catch (err) {

      // If something in the process fails, we must
      // undo everything done in the process so the
      // user can try again.
      await destroyAll(User)
      await destroyAll(Post)
      await destroyAll(Page)

      return await done(500, { error: err.message })
    }
  }

  return res.status(404).send({ message: 'Page not found.' })
}
