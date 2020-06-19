import serverContext from "@/serverContext"
import User from "@/models/user"


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query

    if (user._id.equals(id)) {
      return await done(401, { message: 'You cannot delete yourself.' })
    }

    try {
      await User.findOneAndDelete({ _id: id })
      return await done(200, { message: 'user deleted' })
    } catch (err) {
      return await done(400, { message: err.message })
    }
  }

  return await done(404, { message: 'Page not found.' })
}
