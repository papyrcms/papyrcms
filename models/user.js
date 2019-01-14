const mongoose = require( 'mongoose' )
const passportLocalMongoose = require( 'passport-local-mongoose' )

const userSchema = new mongoose.Schema({

  // Authentication info
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },

  // Personal Info
  email: String,
  firstName: String,
  lastName: String,

  // Account creation date
  created: { type: Date, default: Date.now }
},
{
  usePushEach: true
})

userSchema.plugin( passportLocalMongoose )

module.exports = mongoose.model( 'user', userSchema )
