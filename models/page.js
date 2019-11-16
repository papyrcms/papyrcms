const { Schema, model } = require('mongoose')

const pageSchema = new Schema({

  className: String,
  title: String,
  url: { type: String, required: true },
  sections: [{
    type: String,
    tags: [String],
    title: String,
    maxPosts: Number,
    className: String
  }],

  created: { type: Date, default: Date.now },
})

module.exports = model('page', pageSchema)
