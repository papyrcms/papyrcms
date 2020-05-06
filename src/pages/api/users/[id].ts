import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../middleware/common/"
import isAdmin from "../../../middleware/isAdmin"
import User from "../../../models/user"


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.delete(async (req: NextApiRequest & Req, res: NextApiResponse) => {
  const { id } = req.query

  // @ts-ignore _id.equals fails typechecks because it's actually a mongoose OID
  if (req.user._id.equals(id)) {
    return res.status(401).send({ message: 'You cannot delete yourself.' })
  }

  try {
    await User.findOneAndDelete({ _id: id })
    return res.status(200).send({ message: 'user deleted' })
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
