import connect from "next-connect"
import common from "../../../middleware/common"
import isAdmin from "../../../middleware/isAdmin"
import Message from "../../../models/message"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.delete(async (req, res) => {
  await Message.findByIdAndDelete(req.query.id)
  return res.send("message deleted")
})


export default handler
