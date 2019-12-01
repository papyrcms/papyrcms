const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({

  className: String,
  route: { type: String, required: true, unique: true },
  // This will be JSON
  sections: [String],
  css: String,

  created: { type: Date, default: Date.now },
})

module.exports = mongoose.model('page', pageSchema)
