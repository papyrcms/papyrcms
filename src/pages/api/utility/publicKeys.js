import keys from '@/keys'


export default (req, res) => {

  if (req.method === 'GET') {
    const {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey
    } = keys
    const publicKeys = {
      googleAnalyticsId,
      googleMapsKey,
      stripePublishableKey
    }
    return res.status(200).send(publicKeys)
  }

  return res.status(404).send({ message: 'Page not found.' })
}
