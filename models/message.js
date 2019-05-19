const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  emailSent: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
})

module.exports = mongoose.model('message', messageSchema)
