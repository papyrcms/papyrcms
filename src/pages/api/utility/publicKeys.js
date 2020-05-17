import connect from "next-connect"
import common from "../../../middleware/common/"
import keys from '../../../config/keys'


const handler = connect()
handler.use(common)


handler.post((req, res) => {
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
})


export default (req, res) => handler.apply(req, res)
