const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({

  // Authentication info
  username: String,
  password: String,
  
  // Personal Info
  email: String,
  firstName: String,
  lastName: String,

  // Account creation date
  created: { type: Date, default: Date.now },
  
  // Etc
  isAdmin: { type: Boolean, default: false },
  isSubscribed: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', userSchema)
