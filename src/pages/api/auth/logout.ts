import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import common from '../../../middleware/common/'


const handler = connect()
handler.use(common)


handler.get((req: NextApiRequest & Req, res: NextApiResponse) => {
  req.logout()
  return res.status(200).send('logged out')
})


export default (req: NextApiRequest & Req, res: NextApiResponse) => handler.apply(req, res)
