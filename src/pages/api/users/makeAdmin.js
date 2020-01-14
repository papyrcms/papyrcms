import connect from 'next-connect'
import common from '../../../middleware/common'
import isAdmin from '../../../middleware/isAdmin'
import User from '../../../models/user'


const handler = connect()
handler.use(common)
handler.use(isAdmin)


handler.put(async (req, res) => {
  const { userId, isAdmin } = req.body

  await User.findByIdAndUpdate(userId, { isAdmin })
  return res.send({ message: 'Success' })
})


export default handler
