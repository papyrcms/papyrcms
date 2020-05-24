import serverContext from '@/serverContext'
import User from '@/models/user'


export default async (req, res) => {

  const { user } = await serverContext(req, res)
  if (!user || !user.isAdmin) {
    return res.status(403).send({ message: "You are not allowed to do that." })
  }

  if (req.method === 'PUT') {
    const { userId, isAdmin } = req.body

    await User.findByIdAndUpdate(userId, { isAdmin })
    return res.status(200).send({ message: 'Success' })
  }

  return res.status(404).send({ message: 'Page not found.' })
}
