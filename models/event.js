const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({

  title: String,
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  date: { type: Date, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
})

module.exports = mongoose.model('event', eventSchema)
