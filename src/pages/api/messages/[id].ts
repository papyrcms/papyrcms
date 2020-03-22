import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import Message from "../../../models/message"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  await Message.findByIdAndDelete(req.query.id)
  return res.status(200).send("message deleted")
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
