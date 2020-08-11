import serverContext from "@/serverContext"


export default async (req, res) => {

  const { user, done, database } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    const { destroy, Message } = database
    await destroy(Message, { _id: req.query.id })
    return done(200, "message deleted")
  }

  return done(404, { message: 'Page not found.' })
}
