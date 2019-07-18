const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({

  title: String,
  content: String,
  tags: [String],
  mainMedia: String,
  subImages: [String],
  published: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

module.exports = mongoose.model('post', postSchema)
