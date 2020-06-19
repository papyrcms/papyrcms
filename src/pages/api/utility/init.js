import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serverContext from '@/serverContext'
import keys from '@/keys'
import User from '@/models/user'
import Post from '@/models/post'
import Page from '@/models/page'


export default async (req, res) => {

  if (req.method === 'POST') {

    const { done } = await serverContext(req, res)

    // Since this is the initial site setup,
    // only run if there are no users, posts, or pages
    const userCount = await User.estimatedDocumentCount()
    const postCount = await Post.estimatedDocumentCount()
    const pageCount = await Page.estimatedDocumentCount()

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

      const user = new User({
        email,
        password: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true
      })
      await user.save()

      // generate a signed json web token with the contents of user object and return it in the response
      const now = new Date()
      const expiry = new Date(now).setDate(now.getDate() + 30)

      const token = jwt.sign({
        uid: user._id,
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(expiry / 1000)
      }, keys.jwtSecret)

      // Next create the header and footer
      const header = new Post({
        title: headerTitle,
        content: headerSubtitle,
        mainMedia: siteLogo,
        tags: ['section-header'],
        published: true
      })
      await header.save()

      const footer = new Post({
        title: footerTitle,
        content: footerSubtitle,
        tags: ['section-footer'],
        published: true
      })
      await footer.save()

      // Next, create the first landing page
      const pagePost = new Post({
        title: pageHeader,
        content: pageContent,
        mainMedia: pageImage,
        tags: ['first-page'],
        published: true
      })
      await pagePost.save();

      const page = new Page({
        title: 'Home',
        route: 'home',
        navOrder: 1,
        sections: [JSON.stringify({
          type: "Standard",
          tags: ["first-page"],
          maxPosts: 1
        })]
      })
      await page.save()

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
      await User.deleteMany({})
      await Post.deleteMany({})
      await Page.deleteMany({})

      return await done(500, { error: err.message })
    }
  }

  return res.status(404).send({ message: 'Page not found.' })
}
