import common from "../../../utilities/serverContext/"
import User from "../../../models/user"


export default async (req, res) => {

  const { user } = await common(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'GET') {
    const users = await User.find()
    return res.status(200).send(users)
  }

  return res.status(404).send({ message: 'Page not found.' })
}