const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: { type: Object, required: true }
})

module.exports = mongoose.model('settings', settingsSchema)
