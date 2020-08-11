import serverContext from "@/serverContext"


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return await done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const { findAll, User } = database
    const users = await findAll(User)
    return await done(200, users)
  }

  return await done(404, { message: 'Page not found.' })
}