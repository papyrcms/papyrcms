import connect from 'next-connect'
import common from '../../../middleware/common/'


const handler = connect()
handler.use(common)


handler.get((req, res) => {
  req.logout()
  return res.status(200).send('logged out')
})


export default (req, res) => handler.apply(req, res)
