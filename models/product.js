import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({

  title: String,
  slug: String,
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 }
})

export default mongoose.model('product', productSchema)
