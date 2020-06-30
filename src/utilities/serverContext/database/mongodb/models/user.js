import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

  // Authentication info
  email: { type: String, unique: true },
  password: String,

  // Personal Info
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

export default mongoose.models.user || mongoose.model('user', userSchema)
