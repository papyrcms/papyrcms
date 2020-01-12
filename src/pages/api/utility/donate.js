import Payments from '../../../utilities/payments'


export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  if (!res.locals.settings.enableDonations) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }

  const chargeInfo = {
    email: req.body.email,
    amount: req.body.amount,
    source: req.body.source,
    description: "Single Donation"
  }

  try {
    const payments = new Payments()
    const charge = await payments.makePayment(chargeInfo)

    res.send(charge)
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
