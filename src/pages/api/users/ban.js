import connect from "next-connect"
import common from "../../../middleware/common"
import isAdmin from "../../../middleware/isAdmin"
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.put(async (req, res) => {
  const { userId, isBanned } = req.body

  await User.findByIdAndUpdate(userId, { isBanned })
  return res.send({ message: 'success' })
})


export default handler
