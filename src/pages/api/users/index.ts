import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.get(async (req, res) => {
  const users = await User.find()
  return res.status(200).send(users)
})


export default (req, res) => handler.apply(req, res)
