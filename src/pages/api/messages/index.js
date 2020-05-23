import serverContext from '../../../utilities/serverContext/'
import Mailer from "../../../utilities/mailer"
import keys from "../../../config/keys"
import Message from '../../../models/message'


const getMessages = async () => {
  return await Message.find().sort({ created: -1 })
}


const createMessage = async (body, enableEmailingToAdmin) => {
  const messageBody = {
    name: body.name,
    email: body.email,
    message: body.message,
    emailSent: false
  }

  if (enableEmailingToAdmin) {
    const mailer = new Mailer()
    const subject = `New message from ${messageBody.name}!`

    const sent = mailer.sendEmail(messageBody, keys.adminEmail, "contact", subject)

    if (sent) {
      messageBody.emailSent = true
    }
  }

  const message = new Message(messageBody)
  await message.save()
  return message
}


export default async (req, res) => {

  const { user } = await serverContext(req, res)

  if (req.method === 'GET') {
    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: 'You are not allowed to do that.' })
    }
    const messages = await getMessages()
    return res.status(200).send(messages)
  }


  if (req.method === 'POST') {
    const message = await createMessage(req.body, res.locals.settings.enableEmailingToAdmin)
    return res.status(200).send(message)
  }

  return res.status(400).send({ message: 'Page not found' })
}