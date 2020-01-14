import connect from "next-connect"
import common from "../../../middleware/common"
import keys from '../../../config/keys'


const handler = connect()
handler.use(common)


handler.post((req, res) => {
  return res.send(keys.googleAnalyticsId)
})


export default handler
