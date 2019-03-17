const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

  title: String,
  description: String,
  tags: [String],
  mainImage: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  quantity: Number
},
{
  usePushEach: true
})

module.exports = mongoose.model('product', productSchema)
