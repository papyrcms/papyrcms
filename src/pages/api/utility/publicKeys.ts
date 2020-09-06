import { NextApiRequest, NextApiResponse } from 'next'
import keys from '@/keys'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey,
    } = keys
    const publicKeys = {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey,
    }
    return res.status(200).send(publicKeys)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
