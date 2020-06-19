import serverContext from '@/serverContext'
import User from '@/models/user'


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    const { userId, isAdmin } = req.body

    await User.findByIdAndUpdate(userId, { isAdmin })
    return await done(200, { message: 'Success' })
  }

  return await done(404, { message: 'Page not found.' })
}
