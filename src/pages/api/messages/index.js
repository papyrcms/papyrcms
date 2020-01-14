import connect from 'next-connect'
import common from '../../../middleware/common'
import Mailer from "../../../utilities/mailer"
import keys from "../../../config/keys"
import Message from '../../../models/message'


const handler = connect()
handler.use(common)


const getMessages = async () => {
  return await Message.find().sort({ created: -1 })
}


const createMessage = async (body, enableEmailingToAdmin) => {
  const message = new Message({
    name: body.name,
    email: body.email,
    message: body.message
  })

  if (enableEmailingToAdmin) {
    const mailer = new Mailer()
    const subject = `New message from ${message.name}!`

    const sent = mailer.sendEmail(message, keys.adminEmail, "contact", subject)

    if (sent) {
      message.emailSent = true
    }
  }

  await message.save()
  return message
}


handler.get(async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).send({ message: 'You are not allowed to do that.' })
  }
  const messages = await getMessages()
  return res.send(messages)
})


handler.post(async (req, res) => {
  const message = await createMessage(req.body, res.locals.settings.enableEmailingToAdmin)
  return res.send(message)
})


export default handler
