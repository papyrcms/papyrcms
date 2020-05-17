import { NextApiRequest, NextApiResponse } from 'next'
import connect from "next-connect"
import common from "../../../middleware/common/"
import keys from '../../../config/keys'


const handler = connect()
handler.use(common)


handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const {
    googleAnalyticsId,
    googleMapsKey,
    stripePubKey
  } = keys
  const publicKeys = {
    googleAnalyticsId,
    googleMapsKey,
    stripePubKey
  }
  return res.status(200).send(publicKeys)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
