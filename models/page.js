const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({

  className: String,
  route: { type: String, required: true },
  // This will be JSON
  sections: [String],

  created: { type: Date, default: Date.now },
})

module.exports = mongoose.model('page', pageSchema)
