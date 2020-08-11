import serverContext from "@/serverContext"


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    const { destroy, User } = database

    // Non-strict for DBs with non-string ObjectId types
    if (user._id == id) {
      return await done(401, { message: 'You cannot delete yourself.' })
    }

    try {
      await destroy(User, { _id: id })
      return await done(200, { message: 'user deleted' })
    } catch (err) {
      return await done(400, { message: err.message })
    }
  }

  return await done(404, { message: 'Page not found.' })
}
