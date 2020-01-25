import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.delete(async (req, res) => {
  const { id } = req.query

  if (id === req.user._id) {
    return res.status(401).send({ message: 'You cannot delete yourself.' })
  }

  try {
    await User.findOneAndDelete({ _id: id })
    return res.send({ message: 'user deleted' })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
})


export default handler
