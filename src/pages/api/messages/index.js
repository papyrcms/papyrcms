import serverContext from '@/serverContext'
import Mailer from "@/utilities/mailer"
import keys from "@/keys"


const getMessages = async (database) => {
  const { findAll, Message } = database
  return await findAll(Message, {}, { sort: { created: -1 } })
}


const createMessage = async (body, enableEmailingToAdmin, database) => {

  const messageBody = {
    name: body.name,
    email: body.email,
    message: body.message,
    emailSent: false
  }

  if (enableEmailingToAdmin) {
    const mailer = new Mailer(database)
    const subject = `New message from ${messageBody.name}!`

    const sent = mailer.sendEmail(messageBody, keys.adminEmail, "contact", subject)

    if (sent) {
      messageBody.emailSent = true
    }
  }

  const { create, Message } = database
  return await create(Message, messageData)
}


export default async (req, res) => {

  const { user, settings, done, database } = await serverContext(req, res)

  if (req.method === 'GET') {
    if (!user || !user.isAdmin) {
      return await done(403, { message: 'You are not allowed to do that.' })
    }
    const messages = await getMessages(database)
    return await done(200, messages)
  }


  if (req.method === 'POST') {
    const message = await createMessage(req.body, settings.enableEmailingToAdmin, database)
    return await done(200, message)
  }

  return await done(400, { message: 'Page not found' })
}
