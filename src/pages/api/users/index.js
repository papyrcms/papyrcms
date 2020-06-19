import serverContext from "@/serverContext"
import User from "@/models/user"


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const users = await User.find()
    return await done(200, users)
  }

  return await done(404, { message: 'Page not found.' })
}