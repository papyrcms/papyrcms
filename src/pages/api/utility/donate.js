import common from '../../../utilities/serverContext/'
import Payments from '../../../utilities/payments'


export default async (req, res) => {

  if (req.method === 'POST') {

    await common(req, res)

    const chargeInfo = {
      email: req.body.email,
      amount: req.body.amount,
      source: req.body.source,
      description: "Single Donation"
    }

    const payments = new Payments()
    const charge = await payments.makePayment(chargeInfo)

    return res.status(200).send(charge)
  }

  return res.status(404).end({ message: 'Page not found.' })
}
