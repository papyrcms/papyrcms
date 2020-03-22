import { NextApiRequest, NextApiResponse } from 'next'
import connect from 'next-connect'
import common from '../../../middleware/common/'
import Payments from '../../../utilities/payments'


const handler = connect()
handler.use(common)


handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const chargeInfo = {
    email: req.body.email,
    amount: req.body.amount,
    source: req.body.source,
    description: "Single Donation"
  }

  const payments = new Payments()
  const charge = await payments.makePayment(chargeInfo)

  return res.status(200).send(charge)
})


export default (req: NextApiRequest, res: NextApiResponse) => handler.apply(req, res)
