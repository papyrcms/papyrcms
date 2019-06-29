const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

  title: String,
  content: { type: String, default: '' },
  tags: [{ type: String, default: '' }],
  mainMedia: { type: String, default: '' },
  subImages: [{ type: String, default: '' }],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 }
})

module.exports = mongoose.model('product', productSchema)
