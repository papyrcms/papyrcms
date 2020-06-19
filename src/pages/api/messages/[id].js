import serverContext from "@/serverContext"
import Message from "@/models/message"


export default async (req, res) => {

  const { user, done } = await serverContext(req, res)

  if (!user || !user.isAdmin) {
    return done(403, { message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    await Message.findByIdAndDelete(req.query.id)
    return done(200, "message deleted")
  }

  return done(404, { message: 'Page not found.' })
}
