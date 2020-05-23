import serverContext from "../../../utilities/serverContext/"
import User from "../../../models/user"


export default async (req, res) => {

  const { user } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query

    if (user._id.equals(id)) {
      return res.status(401).send({ message: 'You cannot delete yourself.' })
    }

    try {
      await User.findOneAndDelete({ _id: id })
      return res.status(200).send({ message: 'user deleted' })
    } catch (err) {
      return res.status(400).send({ message: err.message })
    }
  }

  return res.status(404).send({ message: 'Page not found.' })
}
