import connect from "next-connect"
import common from "../../../middleware/common/"
import keys from "../../../config/keys"


const handler = connect()
handler.use(common)


handler.post((req, res) => {
  return res.status(200).send(keys.stripePublishableKey)
})


export default (req, res) => handler.apply(req, res)
