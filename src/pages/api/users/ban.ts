import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, isBanned } = req.body

  await User.findByIdAndUpdate(userId, { isBanned })
  return res.status(200).send({ message: 'Success' })
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
