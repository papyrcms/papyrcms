import serverContext from '@/serverContext'
import Mailer from "@/utilities/mailer"
import keys from "@/keys"
import Message from '@/models/message'


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

  const { user, settings, done } = await serverContext(req, res)

  if (req.method === 'GET') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const messages = await getMessages()
    return await done(200, messages)
  }


  if (req.method === 'POST') {
    const message = await createMessage(req.body, settings.enableEmailingToAdmin)
    return await done(200, message)
  }

  return await done(400, { message: 'Page not found' })
}
