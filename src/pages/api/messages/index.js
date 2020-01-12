import mongoose from "mongoose"
import Mailer from "../utilities/mailer"
import keys from "../config/keys"
const { message: Message } = mongoose.models


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


export default async (req, res) => {
  try {
    let response
    switch (req.method) {
      case 'GET':
        if (!req.user || !req.user.isAdmin) {
          return res.status(403).send({ message: 'You are not allowed to do that.' })
        }
        response = await getMessages()
        return res.send(response)
      case 'POST':
        response = await createMessage(req.body, res.locals.settings.enableEmailingToAdmin)
        return res.send(response)
      default:
        return res.status(404).send({ message: 'Endpoint not found.' })
    }
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
