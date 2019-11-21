const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  publishDate: Date,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

module.exports = mongoose.model('blog', blogSchema)
