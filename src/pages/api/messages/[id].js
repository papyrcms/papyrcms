import mongoose from 'mongoose'
const { message: Message } = mongoose.models


export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(404).send({ message: 'Endpoint not found.' })
  }

  try {
    await Message.findByIdAndDelete(req.query.id)
    return res.send("message deleted")
  } catch (err) {
    return res.status(400).send({ message: err.message })
  }
}
