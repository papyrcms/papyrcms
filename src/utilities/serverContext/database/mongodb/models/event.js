import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({

  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  date: { type: Date, required: true },
  latitude: Number,
  longitude: Number
})

export default mongoose.models.event || mongoose.model('event', eventSchema)
