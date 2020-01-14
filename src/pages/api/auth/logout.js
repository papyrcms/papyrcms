import connect from 'next-connect'
import common from '../../../middleware/common'


const handler = connect()
handler.use(common)


handler.get((req, res) => {
  req.logout()
  return res.send('logged out')
})


export default handler
