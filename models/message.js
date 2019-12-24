import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  emailSent: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
})

export default mongoose.model('message', messageSchema)
