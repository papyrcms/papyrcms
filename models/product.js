const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

  title: String,
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 }
})

module.exports = mongoose.model('product', productSchema)
