import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new mongoose.Schema({

  // Authentication info
  username: String,
  password: String,

  // Personal Info
  email: String,
  firstName: String,
  lastName: String,

  // Billing info
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  country: String,

  // Shipping info
  shippingFirstName: String,
  shippingLastName: String,
  shippingEmail: String,
  shippingAddress1: String,
  shippingAddress2: String,
  shippingCity: String,
  shippingState: String,
  shippingZip: String,
  shippingCountry: String,

  // Shop info
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],

  // Account creation date
  created: { type: Date, default: Date.now },

  // Etc
  isAdmin: { type: Boolean, default: false },
  isSubscribed: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false }
})

userSchema.plugin(passportLocalMongoose)

export default mongoose.model('user', userSchema)
