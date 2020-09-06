import { NextApiRequest, NextApiResponse } from 'next'
import serverContext from '@/serverContext'
import Payments from '@/utilities/payments'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { done } = await serverContext(req, res)

    const chargeInfo = {
      email: req.body.email,
      amount: req.body.amount,
      source: req.body.source,
      description: 'Single Donation',
    }

    const payments = new Payments()
    const charge = await payments.makePayment(chargeInfo)

    return await done(200, charge)
  }

  return res.status(404).end({ message: 'Page not found.' })
}
